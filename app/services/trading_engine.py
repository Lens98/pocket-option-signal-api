from datetime import datetime, timezone
import os

from app.entry.entry_engine import EntryEngine
from app.models.market import MarketData
from app.models.signal import Signal
from app.services.confidence_engine import ConfidenceEngine
from app.services.indicator_service import IndicatorService
from app.services.strategy_service import StrategyService
from app.services.ai_reason_service import AIReasonService
from app.services.market_regime import MarketRegimeDetector
from app.support_resistance.support_resistance import SupportResistance
from app.risk.risk_manager import RiskManager
from app.services.openai_reviewer import OpenAIReviewer
from app.services.probability_engine import ProbabilityEngine
from app.timeframe.builder import TimeframeBuilder
from app.timeframe.trend import TrendAnalyzer
from app.timeframe.filter import MultiTimeframeFilter
from app.services.session_detector import SessionDetector
from app.storage.shared import trade_storage
from app.services.signal_lock import SignalLock
from app.services.market_quality import MarketQuality
from app.services.pattern_fingerprint import PatternFingerprint
from app.storage.shared import trade_state
from app.services.candle_strategy import CandleStrategy
from app.services.signal_agreement import SignalAgreement
from app.services.learning_analyzer import LearningAnalyzer
from app.services.presentation_builder import PresentationBuilder
from app.services.entry_manager import (
    EntryManager,
    EntryState,
)

DEBUG_LOGS = os.getenv("DEBUG_LOGS", "false").lower() == "true"


def debug_print(*args, **kwargs):
    if DEBUG_LOGS:
        print(*args, **kwargs)


class TradingEngine:

    def __init__(self):

        # ----------------------------------------
        # Core Services
        # ----------------------------------------

        self.indicators = IndicatorService()
        self.strategy = StrategyService()
        self.ai = AIReasonService()
        self.trade_state = trade_state
        self.entry_manager = EntryManager()
        self.entry_engine = EntryEngine()
        # NEW
        self.confidence = ConfidenceEngine()
        self.market_quality = MarketQuality()
        self.market_regime = MarketRegimeDetector()
        # NEW
        self.probability = ProbabilityEngine()
        self.agreement = SignalAgreement()
        self.pattern_fingerprint = PatternFingerprint()
        self.session = SessionDetector()
        self.signal_lock = SignalLock()
        self.learning = LearningAnalyzer()
        self.candle_strategy = CandleStrategy()
        self.openai = OpenAIReviewer()
        # ----------------------------------------
        # Risk
        # ----------------------------------------
        self.presentation = PresentationBuilder()  # ⭐ NEW
        self.risk = RiskManager()

        # ----------------------------------------
        # Support / Resistance
        # ----------------------------------------

        self.support = SupportResistance()
        # ----------------------------------------
        # Candle Tracking
        # ----------------------------------------

        self.last_minute_bucket = None

        # ----------------------------------------
        # Multi Timeframe
        # ----------------------------------------

        self.timeframes = TimeframeBuilder()
        self.trend = TrendAnalyzer()
        self.filter = MultiTimeframeFilter()

        # ----------------------------------------
        # Trade Storage
        # ----------------------------------------

        self.trade_storage = trade_storage

    # =====================================================
    # Generate Trading Signal
    # =====================================================
    @staticmethod
    def get_minute_bucket(timestamp):

        try:
            value = float(timestamp)

        except (TypeError, ValueError):

            try:
                value = datetime.fromisoformat(
                    str(timestamp).replace("Z", "+00:00")
                ).timestamp()

            except (TypeError, ValueError):

                return None

        # Milliseconds
        if value > 10_000_000_000:
            value = value / 1000

        return int(value) - (int(value) % 60)

    def generate_signal(self, market, indicator_result=None):

        # ----------------------------------------
        # ACTIVE TRADE LOCK
        # ----------------------------------------
        # Never generate a new signal while an
        # existing trade is still active.

        # ----------------------------------------
        # ACTIVE TRADE LOCK
        # ----------------------------------------

        if self.signal_lock.is_trade_locked():

            locked = self.signal_lock.current()
            trade_id = self.signal_lock.trade_id

            print("----------------------------------------")
            print("🔒 ACTIVE TRADE LOCKED")
            print("----------------------------------------")

            print("Trade ID :", trade_id)

            # Check whether the locked trade still exists
            trade = self.trade_storage.find(trade_id) if trade_id else None

            # ----------------------------------------
            # Trade finished
            # ----------------------------------------

            if trade is None or trade.status != "OPEN":

                print("----------------------------------------")
                print("✅ ACTIVE TRADE FINISHED")
                print("----------------------------------------")

                if trade is not None:

                    print("Trade ID :", trade.id)
                    print("Status   :", trade.status)
                    print("Result   :", trade.result)
                    print("Profit   :", trade.profit)

                self.signal_lock.unlock()

                print("🔓 SIGNAL LOCK RELEASED")
                print("----------------------------------------")

            # ----------------------------------------
            # Trade still active
            # ----------------------------------------

            else:

                print("Status   :", trade.status)
                print("Asset    :", locked.asset)
                print("Bias     :", locked.bias)
                print("Action   :", locked.action)
                print("State    :", locked.market_state)

                return locked

        debug_print()
        debug_print("========================================")
        debug_print("🚀 NEW MARKET UPDATE")
        debug_print("========================================")
        debug_print("Asset      :", market.asset)
        debug_print("Timeframe  :", market.timeframe)
        debug_print("Candles    :", len(market.candles))
        debug_print("========================================")

        # ----------------------------------------
        # Need enough candles
        # ----------------------------------------

        if len(market.candles) < 15:

            print("❌ Not enough candles")

            return Signal(
                asset=market.asset,
                timeframe=market.timeframe,
                action="WAIT",
                confidence=0,
                trend="SIDEWAYS",
                expiration="Next Candle",
                entry_price=market.candles[-1].close,
                timestamp=datetime.now(),
                risk="HIGH",
                reasons=["Not enough candles"],
            )

        # ----------------------------------------
        # Build Timeframes
        # ----------------------------------------

        frames = self.timeframes.build(market.candles)

        print("----------------------------------------")
        print("Higher Timeframes")
        print("----------------------------------------")
        print("1m :", len(frames["1m"]))
        print("5m :", len(frames["5m"]))
        print("15m:", len(frames["15m"]))
        # ----------------------------------------
        # Analyze 1m Trend
        # ----------------------------------------

        trend_1m = self.trend.analyze(
            MarketData(asset=market.asset, timeframe="1m", candles=frames["1m"])
        )

        # ----------------------------------------
        # Analyze 5m Trend
        # ----------------------------------------

        trend_5m = self.trend.analyze(
            MarketData(asset=market.asset, timeframe="5m", candles=frames["5m"])
        )

        # ----------------------------------------
        # Analyze 15m Trend
        # ----------------------------------------

        trend_15m = self.trend.analyze(
            MarketData(asset=market.asset, timeframe="15m", candles=frames["15m"])
        )

        print("----------------------------------------")
        print("1m Trend :", trend_1m)
        print("5m Trend :", trend_5m)
        print("15m Trend:", trend_15m)

        # ----------------------------------------
        # Multi Timeframe Filter
        # ----------------------------------------

        filter_result = self.filter.evaluate(trend_1m, trend_5m, trend_15m)
        allowed = filter_result["allowed"]

        print("----------------------------------------")
        print("Trade Allowed :", allowed)
        print("Reason        :", filter_result["reason"])

        if not allowed:

            print("⚠ Multi-Timeframe not confirmed")

            filter_block_reason = filter_result["reason"]

        else:

            filter_block_reason = None

        # ----------------------------------------
        # Indicators
        # ----------------------------------------

        if indicator_result is None:

            try:

                indicator_result = self.indicators.calculate(market)

                regime = self.market_regime.detect(indicator_result)

                print()
                print("========================================")
                print("MARKET REGIME")
                print("========================================")
                print("Regime         :", regime.regime)
                print("Confidence     :", regime.confidence)
                print("Volatility     :", regime.volatility)
                print("Trend Strength :", regime.trend_strength)
                print("----------------------------------------")

                for reason in regime.reasons:

                    print("✓", reason)

                print("========================================")
                print()
                print("----------------------------------------")
                print("Indicator Mode")
                print("----------------------------------------")
                print(indicator_result.mode)
                print("----------------------------------------")

            except ValueError as e:

                print("----------------------------------------")
                print("----------------------------------------")
                print("AI Warming Up")
                print("----------------------------------------")
                print("Collecting market history...")
                print(str(e))
                print("----------------------------------------")
                print(e)
                print("----------------------------------------")

                return Signal(
                    asset=market.asset,
                    timeframe=market.timeframe,
                    action="WAIT",
                    confidence=0,
                    trend="SIDEWAYS",
                    expiration="Next Candle",
                    entry_price=market.candles[-1].close,
                    timestamp=datetime.now(),
                    risk="HIGH",
                    reasons=[str(e)],
                )

        print("----------------------------------------")
        print("Indicator Result")
        print("----------------------------------------")
        print(indicator_result)

        # ----------------------------------------
        # Support & Resistance
        # ----------------------------------------

        self.support.analyze(market.candles)

        print("----------------------------------------")
        print("Support / Resistance Updated")
        print("----------------------------------------")

        if "regime" not in locals():

            regime = self.market_regime.detect(indicator_result)

        # ----------------------------------------
        # Analyze Market
        # ----------------------------------------

        signal = self.strategy.analyze(market, indicator_result)
        # ----------------------------------------
        # Candle Strategy
        # ----------------------------------------

        candle_result = self.candle_strategy.analyze(market.candles)

        print()
        print("========================================")
        print("CANDLE STRATEGY")
        print("========================================")
        print("Pattern     :", candle_result["pattern"])
        print("Direction   :", candle_result["direction"])
        print("Strength    :", candle_result["strength"])
        print("Trade       :", candle_result["can_trade"])
        print("========================================")

        signal.candle_confirmed = candle_result["confirmed"]

        signal.candle_pattern = candle_result["pattern"]

        signal.candle_strength = candle_result["strength"]

        # ----------------------------------------
        # FINAL NEXT-CANDLE BIAS
        # ----------------------------------------
        # A next-candle prediction is only valid
        # when the final market bias is CALL/PUT.
        #
        # WAIT must remain WAIT.
        # The candlestick direction must never
        # override a WAIT market decision.
        # ----------------------------------------

        candle_direction = str(candle_result.get("direction", "WAIT") or "WAIT").upper()

        if signal.bias in ["CALL", "PUT"]:

            if candle_direction == signal.bias:

                # Market bias and candle direction agree.
                signal.next_candle_bias = signal.bias

                print("✅ CANDLE BIAS AGREEMENT")
                print("Market Bias     :", signal.bias)
                print("Candle Direction:", candle_direction)
                print("Next Candle Bias:", signal.next_candle_bias)

            else:

                # Market bias and candle direction conflict.
                # Do NOT create a directional prediction.
                signal.next_candle_bias = "WAIT"

                print("⚠️ CANDLE BIAS CONFLICT")
                print("Market Bias     :", signal.bias)
                print("Candle Direction:", candle_direction)
                print("Next Candle Bias: WAIT")
                print("Reason          : Market and candle directions disagree.")

        else:

            signal.next_candle_bias = "WAIT"

            print("🟡 NO MARKET BIAS")
            print("Market Bias     :", signal.bias)
            print("Candle Direction:", candle_direction)
            print("Next Candle Bias: WAIT")
        # ----------------------------------------
        # Build Pattern Fingerprint
        # ----------------------------------------

        signal.pattern = self.pattern_fingerprint.build(signal)

        # ----------------------------------------
        # Learning Statistics
        # ----------------------------------------

        pattern_stats = self.learning.pattern(signal.pattern)
        asset_stats = self.learning.asset(market.asset)

        print()
        print("========================================")
        print("LEARNING ENGINE")
        print("========================================")

        print("Pattern :", signal.pattern)
        print("Trades  :", pattern_stats["trades"])
        print("WinRate :", pattern_stats["win_rate"])
        print("Wins    :", pattern_stats["wins"])
        print("Losses  :", pattern_stats["losses"])

        print("----------------------------------------")

        print("Asset   :", signal.asset)
        print("Trades  :", asset_stats["trades"])
        print("WinRate :", asset_stats["win_rate"])
        print("Wins    :", asset_stats["wins"])
        print("Losses  :", asset_stats["losses"])

        print("========================================")

        print("----------------------------------------")
        print("Pattern Fingerprint")
        print("----------------------------------------")
        print(signal.pattern)
        print("----------------------------------------")
        agreement = self.agreement.calculate(signal, indicator_result)
        market_quality = self.market_quality.calculate(signal)

        signal.agreement_score = agreement["agreement"]

        signal.confirmation_count = agreement["confirmations"]

        signal.confirmation_total = agreement["total"]
        # ========================================
        # DEBUG AGREEMENT
        # ========================================

        print("----------------------------------------")
        print("AGREEMENT ENGINE")
        print("----------------------------------------")
        print("Agreement Score :", signal.agreement_score)
        print("Confirmations   :", signal.confirmation_count)
        print("Total           :", signal.confirmation_total)
        print("----------------------------------------")
        # ========================================
        # AI ANALYSIS DATA FOR DASHBOARD
        # ========================================

        signal.ema_status = "✓ Active" if indicator_result.ema20 is not None else "--"

        signal.ema_strength = "Startup" if indicator_result.ema50 is None else "Strong"

        signal.rsi_status = "✓ Momentum" if indicator_result.rsi is not None else "--"

        signal.rsi_strength = "Strong" if indicator_result.rsi is not None else "--"

        signal.macd_status = "--"
        signal.macd_strength = "--"

        if (
            indicator_result.macd is not None
            and indicator_result.signal_line is not None
        ):

            signal.macd_status = (
                "✓ Bullish"
                if indicator_result.macd > indicator_result.signal_line
                else "✓ Bearish"
            )

        if indicator_result.histogram is not None:

            signal.macd_strength = (
                "Strong" if indicator_result.histogram > 0 else "Weak"
            )

        signal.structure_status = "✓ Confirmed" if signal.structure_confirmed else "--"

        signal.structure_strength = "Strong" if signal.structure_confirmed else "--"

        signal.volatility_status = (
            "✓ Active" if indicator_result.atr is not None else "UNKNOWN"
        )

        signal.volatility_strength = (
            "Strong" if indicator_result.atr is not None else "--"
        )

        signal.volume_status = "--"

        signal.volume_strength = "--"

        # ----------------------------------------
        # Save Market Regime
        # ----------------------------------------

        signal.reasons.extend(regime.reasons)

        # Only if Signal has a regime field
        signal.regime = regime.regime

        # ----------------------------------------
        # AI Confidence Engine
        # ----------------------------------------
        signal.probability = self.probability.calculate(signal, indicator_result.mode)

        signal.confidence = self.confidence.calculate(
            signal,
            agreement_score=signal.agreement_score,
            market_quality=market_quality,
            learning_score=signal.probability,
        )

        print("----------------------------------------")
        print("Probability Engine")
        print("----------------------------------------")
        print("Probability :", signal.probability)
        print("----------------------------------------")
        # ----------------------------------------
        # Confidence
        # ----------------------------------------
        # Do not artificially cap confidence because
        # the indicator engine is still in STARTUP mode.
        # The confidence engine already evaluates the
        # available confirmations, agreement, quality,
        # and probability.

        signal.confidence = max(0.0, min(float(signal.confidence), 100.0))

        max_confidence = 100

        print("----------------------------------------")
        print("Confidence Final")
        print("----------------------------------------")
        print("Mode       :", indicator_result.mode)
        print("Confidence :", signal.confidence)
        print("Cap        :", max_confidence)
        print("----------------------------------------")

        # ----------------------------------------
        # Multi-Timeframe Bonus
        # ----------------------------------------

        signal.confidence += filter_result["confidence_bonus"]

        if signal.confidence > 100:

            signal.confidence = 100

        print("----------------------------------------")
        print("Confidence Engine")
        print("----------------------------------------")
        print("Mode       :", indicator_result.mode)
        print("Calculated :", signal.confidence)
        print("Cap        :", max_confidence)
        print("----------------------------------------")

        print("----------------------------------------")
        print("Strategy Output")
        print("----------------------------------------")
        print(signal)

        # ----------------------------------------
        # Complete Signal
        # ----------------------------------------

        signal.asset = market.asset
        signal.timeframe = market.timeframe

        # Binary entry price = OPEN of the newly opened candle
        signal.entry_price = market.candles[-1].open

        signal.timestamp = datetime.now()
        signal.expiration = "Next Candle"

        # ----------------------------------------
        # Risk Manager
        # ----------------------------------------

        risk = self.risk.evaluate(signal)

        print("----------------------------------------")
        print("Risk Result")
        print("----------------------------------------")
        print(risk)

        signal.risk = risk["risk"]
        signal.grade = risk["grade"]

        # ----------------------------------------
        # Entry Manager
        # ----------------------------------------
        print("========================================")
        print("BEFORE ENTRY MANAGER")
        print("========================================")
        print("Bias        :", signal.bias)
        print("Confidence  :", signal.confidence)
        print("Probability :", signal.probability)
        print("Risk        :", signal.risk)
        print("Grade       :", signal.grade)
        print("Trend       :", signal.trend)
        print("========================================")

        # ----------------------------------------
        # CHECK WAITING PREDICTION LOCK
        # ----------------------------------------

        locked = None

        if self.signal_lock.is_locked():

            locked = self.signal_lock.current()

            if locked is not None:

                locked_bucket = getattr(locked, "locked_candle_bucket", None)

                current_bucket = self.get_minute_bucket(market.candles[-1].timestamp)

                print("----------------------------------------")
                print("🔒 CHECKING PREDICTION LOCK")
                print("----------------------------------------")
                print("Locked Bucket :", locked_bucket)
                print("Current Bucket:", current_bucket)
                print("Bias          :", locked.bias)
                print("Action        :", locked.action)
                print("----------------------------------------")

                # ----------------------------------------
                # EXPIRE OLD PREDICTION
                # ----------------------------------------

                if (
                    locked_bucket is not None
                    and current_bucket is not None
                    and current_bucket > locked_bucket + 1
                ):

                    print("----------------------------------------")
                    print("🔓 PREDICTION LOCK EXPIRED")
                    print("----------------------------------------")

                    self.signal_lock.unlock()

                    locked = None

                else:

                    print("----------------------------------------")
                    print("🔒 USING CURRENT PREDICTION")
                    print("----------------------------------------")

                    signal = locked

                # ----------------------------------------
        # DETERMINE ENTRY STATE
        # ----------------------------------------

        if locked is not None:

            # ----------------------------------------
            # PRESERVE LOCKED PREDICTION
            # ----------------------------------------
            #
            # A locked CALL/PUT is already a valid
            # next-candle prediction.
            #
            # DO NOT send it through EntryManager again.
            # DO NOT convert it to WAIT.
            #

            state = EntryState.WAITING_FOR_CANDLE_CLOSE

            signal.action = signal.next_candle_bias

            signal.can_enter = False

            signal.market_state = EntryState.WAITING_FOR_CANDLE_CLOSE.value

            signal.trade_status = "WAITING_FOR_CANDLE"

        else:

            state = self.entry_manager.determine(signal)

        # ----------------------------------------
        # PREPARE CALL / PUT PREDICTION
        # FOR NEXT 1-MINUTE CANDLE
        # ----------------------------------------

        if (
            state == EntryState.WAITING_FOR_CANDLE_CLOSE
            and not self.signal_lock.is_locked()
            and signal.next_candle_bias in ["CALL", "PUT"]
        ):

            signal.action = signal.next_candle_bias

            signal.can_enter = False

            signal.market_state = EntryState.WAITING_FOR_CANDLE_CLOSE.value

            signal.trade_status = "WAITING_FOR_CANDLE"

            # ----------------------------------------
            # LOCK THIS PREDICTION TO CURRENT CANDLE
            # ----------------------------------------

            signal.locked_candle_bucket = self.get_minute_bucket(
                market.candles[-1].timestamp
            )

            print("========================================")
            print("🔒 1-MINUTE PREDICTION LOCKED")
            print("========================================")
            print("Prediction :", signal.bias)
            print("Confidence :", signal.confidence)
            print("Probability:", signal.probability)
            print("Agreement  :", signal.agreement_score)
            print(
                "Confirmations:",
                f"{signal.confirmation_count}/" f"{signal.confirmation_total}",
            )
            print("Locked Bucket:", signal.locked_candle_bucket)
            print("State       :", signal.market_state)
            print("========================================")

        new_candle_opened = False

        latest_candle = market.candles[-1]

        current_minute_bucket = self.get_minute_bucket(latest_candle.timestamp)

        print("----------------------------------------")
        print("1-MINUTE CANDLE CHECK")
        print("----------------------------------------")
        print("Latest Timestamp :", latest_candle.timestamp)
        print("Current Bucket   :", current_minute_bucket)
        print("Previous Bucket  :", self.last_minute_bucket)
        print("----------------------------------------")

        if current_minute_bucket is None:

            print("----------------------------------------")
            print("⚠️ INVALID CANDLE TIMESTAMP")
            print("----------------------------------------")

        elif self.last_minute_bucket is None:

            # First candle received.
            # Establish the current minute.
            # Do NOT enter immediately.

            self.last_minute_bucket = current_minute_bucket

            print("----------------------------------------")
            print("INITIAL 1-MINUTE BUCKET")
            print("----------------------------------------")
            print("Bucket :", current_minute_bucket)
            print("Waiting for next 1-minute candle...")
            print("----------------------------------------")

        elif current_minute_bucket != self.last_minute_bucket:

            new_candle_opened = True

            previous_bucket = self.last_minute_bucket

            self.last_minute_bucket = current_minute_bucket

            print("========================================")
            print("🟢 NEW 1-MINUTE CANDLE OPENED")
            print("========================================")
            print("Previous Bucket :", previous_bucket)
            print("Current Bucket  :", current_minute_bucket)
            print("Timestamp       :", latest_candle.timestamp)
            print("Entry Open      :", latest_candle.open)
            print("========================================")
            print("========================================")
            print("⏱️ BINARY TIMING DEBUG")
            print("========================================")
            print("Current UTC Time :", datetime.now(timezone.utc).isoformat())
            print("Candle Timestamp :", latest_candle.timestamp)
            print("Candle Open      :", latest_candle.open)
            print("Current Bucket   :", current_minute_bucket)
            print("Previous Bucket  :", previous_bucket)
            print("New Candle       :", new_candle_opened)

            if locked is not None:

                print("Locked Bucket    :", locked.locked_candle_bucket)

                print("Locked Prediction:", locked.bias)

                if locked.locked_candle_bucket is not None:

                    print(
                        "Prediction Age   :",
                        current_minute_bucket - locked.locked_candle_bucket,
                    )

            else:

                print("Prediction Age   : UNKNOWN")

        else:

            print("Locked Prediction: NONE")

        print("========================================")

        # ----------------------------------------
        # NEW 1-MINUTE CANDLE = USE LOCKED PREDICTION
        # ----------------------------------------

        if new_candle_opened:

            locked = None

            if self.signal_lock.is_locked():

                locked = self.signal_lock.current()

            if locked is not None:

                candidate_action = str(locked.next_candle_bias or "").upper()

                print("========================================")
                print("🎯 1-MINUTE ENTRY CHECK")
                print("========================================")
                print("Prediction :", candidate_action)
                print("New Candle :", latest_candle.timestamp)
                print("Entry Open :", latest_candle.open)
                print("Confidence :", locked.confidence)
                print("Probability:", locked.probability)
                print("Agreement  :", locked.agreement_score)
                print("----------------------------------------")

                # ----------------------------------------
                # VALIDATE LOCKED CALL / PUT
                # ----------------------------------------

                if candidate_action in ["CALL", "PUT"]:

                    signal = locked

                    signal.action = candidate_action
                    signal.can_enter = True

                    signal.market_state = EntryState.ENTRY.value

                    signal.entry_price = latest_candle.open
                    signal.timestamp = datetime.now()

                    signal.reason = (
                        f"ENTER {candidate_action} " "ON NEW 1-MINUTE CANDLE"
                    )

                    signal.instruction = f"🚀 ENTER {candidate_action} NOW"

                    signal.expiration = "60 seconds"

                    state = EntryState.ENTRY

                    print("========================================")
                    print("🚀 BINARY ENTRY CONFIRMED")
                    print("========================================")
                    print("ACTION      :", signal.action)
                    print("CAN ENTER   :", signal.can_enter)
                    print("ENTRY PRICE :", signal.entry_price)
                    print("CANDLE      :", latest_candle.timestamp)
                    print("CONFIDENCE  :", signal.confidence)
                    print("PROBABILITY :", signal.probability)
                    print("AGREEMENT   :", signal.agreement_score)
                    print("EXPIRATION  : 60 SECONDS")
                    print("----------------------------------------")
                    print(f"🚀 ENTER {candidate_action} NOW")
                    print("========================================")

                    # IMPORTANT:
                    # Do NOT unlock here.
                    #
                    # The lock remains until the trade
                    # is actually created and activated.

                else:

                    print("========================================")
                    print("❌ INVALID LOCKED PREDICTION")
                    print("========================================")
                    print("Prediction :", candidate_action)
                    print("Action     : WAIT")
                    print("========================================")

                    self.signal_lock.unlock()

                    signal.action = "WAIT"
                    signal.can_enter = False
                    signal.market_state = EntryState.WAITING.value
                    signal.trade_status = "IDLE"

                    signal.reason = "INVALID_LOCKED_PREDICTION"

                    signal.instruction = (
                        "Waiting for a new valid CALL " "or PUT prediction."
                    )

                    state = EntryState.WAITING

            else:

                # ----------------------------------------
                # NO NEW CANDLE
                # ----------------------------------------
                #
                # There may still be a valid locked
                # CALL/PUT prediction waiting for the
                # next candle.
                #
                # NEVER convert a locked prediction
                # into WAIT just because the candle
                # has not changed yet.
                #

                if self.signal_lock.is_locked():

                    locked_prediction = self.signal_lock.current()

                    if locked_prediction is not None:

                        signal = locked_prediction

                        signal.action = signal.next_candle_bias

                        signal.can_enter = False

                        signal.market_state = EntryState.WAITING_FOR_CANDLE_CLOSE.value

                        signal.trade_status = "WAITING_FOR_CANDLE"

                        state = EntryState.WAITING_FOR_CANDLE_CLOSE

                        print("========================================")
                        print("🔒 LOCKED PREDICTION PRESERVED")
                        print("========================================")
                        print("Prediction :", signal.next_candle_bias)
                        print("Action     :", signal.action)
                        print("Can Enter  :", signal.can_enter)
                        print("State      :", signal.market_state)
                        print("========================================")

                    else:

                        signal.action = "WAIT"

                        signal.can_enter = False

                        signal.market_state = EntryState.WAITING.value

                        signal.trade_status = "IDLE"

                        state = EntryState.WAITING

                else:

                    print("========================================")
                    print("NO LOCKED 1-MINUTE PREDICTION")
                    print("========================================")
                    print("No CALL/PUT prediction was prepared.")
                    print("Waiting for next AI setup.")
                    print("========================================")

                    signal.action = "WAIT"

                    signal.can_enter = False

                    signal.market_state = EntryState.WAITING.value

                    signal.trade_status = "IDLE"

                    state = (
                        EntryState.WAITING
                    )  # ----------------------------------------
        # CONFIRM ENTRY
        # ----------------------------------------

        signal.market_state = state.value

        self.entry_engine.confirm(signal, state)

        signal = self.presentation.build(signal)

        print("ENTRY STATE :", state)

        print("========================================")
        print("SIGNAL FLOW")
        print("========================================")
        print("Bias      :", signal.bias)
        print("State     :", signal.market_state)
        print("Action    :", signal.action)
        print("Can Enter :", signal.can_enter)
        print("========================================")
        print()

        # ----------------------------------------
        # RISK MANAGER OVERRIDE
        # ----------------------------------------

        if not risk["allowed"] and state != EntryState.ENTRY:

            signal.action = "WAIT"
            signal.market_state = EntryState.WAITING.value
            signal.can_enter = False

            signal.reasons.extend(risk["reasons"])

        # ----------------------------------------
        # FILTER OVERRIDE
        # ----------------------------------------

        if filter_block_reason and state != EntryState.ENTRY:

            signal.action = "WAIT"
            signal.can_enter = False

            signal.reasons.append(filter_block_reason)

        # ----------------------------------------
        # AI EXPLANATION
        # ----------------------------------------

        formatted = self.ai.format(signal)

        # ----------------------------------------
        # SAVE TRADE
        # ----------------------------------------

        if signal.action == "WAIT":

            print("❌ BLOCKED: WAIT signal cannot create trade")

            signal.can_enter = False

        # ----------------------------------------
        # MINIMUM CONFIDENCE FILTER
        # ----------------------------------------

        MIN_CONFIDENCE = 70

        if signal.can_enter and signal.confidence < MIN_CONFIDENCE:

            print("----------------------------------------")
            print("❌ BLOCKED: Confidence too low")
            print("Confidence :", signal.confidence)
            print("Minimum    :", MIN_CONFIDENCE)
            print("----------------------------------------")

            signal.action = "WAIT"
            signal.can_enter = False
            signal.market_state = EntryState.WAITING.value

            signal.reasons.append(f"Confidence below {MIN_CONFIDENCE}%")

        # ----------------------------------------
        # TRADE CREATION
        # ----------------------------------------

        if (
            new_candle_opened
            and signal.can_enter
            and signal.action in ["CALL", "PUT"]
            and state == EntryState.ENTRY
        ):

            print("========================================")
            print("TRADE CREATION CHECK")
            print("========================================")

            # ----------------------------------------
            # HARD OPEN TRADE PROTECTION
            # ----------------------------------------

            open_trades = self.trade_storage.open_trades()

            if open_trades:

                existing = open_trades[0]

                print("========================================")
                print("🛑 TRADE CREATION BLOCKED")
                print("========================================")
                print("An OPEN trade already exists.")
                print("Trade ID :", existing.id)
                print("Asset    :", existing.asset)
                print("Action   :", existing.action)
                print("Status   :", existing.status)
                print("========================================")

                signal.action = "WAIT"
                signal.can_enter = False
                signal.market_state = EntryState.WAITING.value

                signal.reason = "OPEN_TRADE_EXISTS"

                signal.instruction = (
                    "A trade is already active. " "Wait for it to finish."
                )

            else:

                print("========================================")
                print("✅ NO OPEN TRADE")
                print("Creating new binary trade...")
                print("========================================")

                # ----------------------------------------
                # FINAL SIGNAL INFORMATION
                # ----------------------------------------

                signal.asset = market.asset
                signal.timeframe = market.timeframe

                latest_entry_candle = market.candles[-1]

                signal.entry_price = latest_entry_candle.open

                # ----------------------------------------
                # ENTRY TIME
                # ----------------------------------------

                timestamp_value = latest_entry_candle.timestamp

                try:

                    timestamp_number = float(timestamp_value)

                    if timestamp_number > 10_000_000_000:

                        entry_time = datetime.fromtimestamp(
                            timestamp_number / 1000,
                            tz=timezone.utc,
                        )

                    else:

                        entry_time = datetime.fromtimestamp(
                            timestamp_number,
                            tz=timezone.utc,
                        )

                except (
                    TypeError,
                    ValueError,
                    OverflowError,
                ):

                    entry_time = datetime.fromisoformat(
                        str(timestamp_value).replace("Z", "+00:00")
                    )

                if entry_time.tzinfo is None:

                    entry_time = entry_time.replace(tzinfo=timezone.utc)

                else:

                    entry_time = entry_time.astimezone(timezone.utc)

                # ----------------------------------------
                # BINARY ENTRY LOG
                # ----------------------------------------

                print("----------------------------------------")
                print("🎯 BINARY NEXT-CANDLE ENTRY")
                print("----------------------------------------")
                print("Prediction :", signal.bias)
                print(
                    "Candle     :",
                    latest_entry_candle.timestamp,
                )
                print(
                    "Entry Open :",
                    latest_entry_candle.open,
                )
                print(
                    "Entry Time :",
                    entry_time.isoformat(),
                )
                print(
                    "Confidence :",
                    signal.confidence,
                )
                print(
                    "Probability:",
                    signal.probability,
                )
                print(
                    "Agreement  :",
                    signal.agreement_score,
                )
                print(
                    "Action     :",
                    signal.action,
                )
                print(
                    "Expiration :",
                    "60 seconds",
                )
                print("----------------------------------------")

                # ----------------------------------------
                # CREATE TRADE
                # ----------------------------------------

                try:

                    from uuid import uuid4
                    from app.models.trade import Trade

                    trade = Trade(
                        id=str(uuid4()),
                        asset=signal.asset,
                        timeframe=signal.timeframe,
                        confidence=signal.confidence,
                        probability=signal.probability,
                        agreement_score=signal.agreement_score,
                        session=signal.session,
                        action=signal.action,
                        regime=signal.regime,
                        indicator_mode=indicator_result.mode,
                        grade=signal.grade,
                        risk=signal.risk,
                        trend=signal.trend,
                        entry_price=signal.entry_price,
                        exit_price=None,
                        entry_time=entry_time,
                        exit_time=None,
                        expiration_seconds=60,
                        status="OPEN",
                        result="",
                        profit=0.0,
                        payout=0.0,
                        reasons=signal.reasons,
                        pattern=signal.pattern,
                    )

                    self.trade_storage.add(trade)

                    print("----------------------------------------")
                    print("🚀 TRADE CREATED")
                    print("----------------------------------------")
                    print("Trade ID :", trade.id)
                    print("Asset    :", trade.asset)
                    print("Action   :", trade.action)
                    print("Entry    :", trade.entry_price)
                    print("Entry Time:", trade.entry_time)
                    print("Expiration: 60 seconds")
                    print("Status   :", trade.status)
                    print("----------------------------------------")

                    # ----------------------------------------
                    # ACTIVE TRADE LOCK
                    # ----------------------------------------

                    self.signal_lock.lock(
                        signal,
                        reason="ACTIVE",
                        trade_id=trade.id,
                    )

                    self.signal_lock.activate(trade.id)

                    print("----------------------------------------")
                    print("🔒 ACTIVE TRADE LOCKED")
                    print("----------------------------------------")
                    print("Trade ID :", trade.id)
                    print("Asset    :", trade.asset)
                    print("Action   :", trade.action)
                    print("Status   :", trade.status)
                    print("----------------------------------------")

                except Exception as e:

                    print("----------------------------------------")
                    print("❌ TRADE CREATION ERROR")
                    print("----------------------------------------")
                    print(e)
                    print(
                        "----------------------------------------"
                    )  # ----------------------------------------
        # Final Console Output
        # ----------------------------------------

        print()
        print("========================================")
        print("✅ FINAL SIGNAL")
        print("========================================")
        print("Asset       :", signal.asset)
        print("Timeframe   :", signal.timeframe)
        print("Action      :", signal.action)
        print("Confidence  :", signal.confidence)
        print("Trend       :", signal.trend)
        print("Regime      :", signal.regime)
        print("Risk        :", signal.risk)
        print("Grade       :", signal.grade)
        print("Entry Price :", signal.entry_price)
        print("Expiration  :", signal.expiration)
        print("----------------------------------------")

        # ----------------------------------------
        # Reasons
        # ----------------------------------------

        if signal.reasons:

            print("Reasons:")

            for reason in signal.reasons:

                print("  ✓", reason)

        print("----------------------------------------")

        # ----------------------------------------
        # AI Summary
        # ----------------------------------------

        if formatted:

            print("AI Analysis:")

            if isinstance(formatted, dict):

                for section, items in formatted.items():

                    if not items:
                        continue

                    print()
                    print(section)

                    if isinstance(items, list):

                        for item in items:

                            print("   •", item)

                    else:

                        print("   •", items)

            elif isinstance(formatted, list):

                for item in formatted:

                    print("   •", item)

            else:

                print(formatted)

        print("========================================")
        print()

        # ----------------------------------------
        # Return Signal
        # ----------------------------------------

        return signal
