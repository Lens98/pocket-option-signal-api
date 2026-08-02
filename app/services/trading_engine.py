from datetime import datetime
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
from app.services.probability_engine import ProbabilityEngine
from app.timeframe.builder import TimeframeBuilder
from app.timeframe.trend import TrendAnalyzer
from app.timeframe.filter import MultiTimeframeFilter
from app.services.session_detector import SessionDetector
from app.storage.trade_storage import TradeStorage
from app.services.signal_lock import SignalLock
from app.storage.shared import trade_state
from app.services.presentation_builder import PresentationBuilder
from app.services.entry_manager import EntryManager
from app.services.entry_manager import (
    EntryManager,
    EntryState,
)

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
        self.market_regime = MarketRegimeDetector()
        # NEW
        self.probability = ProbabilityEngine()
        self.session = SessionDetector()
        self.signal_lock = SignalLock()
        # ----------------------------------------
        # Risk
        # ----------------------------------------
        self.presentation = PresentationBuilder()   # ⭐ NEW
        self.risk = RiskManager()

        # ----------------------------------------
        # Support / Resistance
        # ----------------------------------------

        self.support = SupportResistance()

        # ----------------------------------------
        # Multi Timeframe
        # ----------------------------------------

        self.timeframes = TimeframeBuilder()
        self.trend = TrendAnalyzer()
        self.filter = MultiTimeframeFilter()

        # ----------------------------------------
        # Trade Storage
        # ----------------------------------------

        self.trade_storage = TradeStorage()

    # =====================================================
    # Generate Trading Signal
    # =====================================================

    def generate_signal(
        self,
        market,
        indicator_result=None
    ):

        print()
        print("========================================")
        print("🚀 NEW MARKET UPDATE")
        print("========================================")
        print("Asset      :", market.asset)
        print("Timeframe  :", market.timeframe)
        print("Candles    :", len(market.candles))
        print("========================================")

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

                reasons=[

                    "Not enough candles"

                ]

            )

        # ----------------------------------------
        # Build Timeframes
        # ----------------------------------------

        frames = self.timeframes.build(

            market.candles

        )

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

        MarketData(

        asset=market.asset,

        timeframe="1m",

        candles=frames["1m"]

         )

       )

        # ----------------------------------------
        # Analyze 5m Trend
        # ----------------------------------------

        trend_5m = self.trend.analyze(

            MarketData(

                asset=market.asset,

                timeframe="5m",

                candles=frames["5m"]

            )

        )

        # ----------------------------------------
        # Analyze 15m Trend
        # ----------------------------------------

        trend_15m = self.trend.analyze(

            MarketData(

                asset=market.asset,

                timeframe="15m",

                candles=frames["15m"]

            )

        )

        print("----------------------------------------")
        print("1m Trend :", trend_1m)
        print("5m Trend :", trend_5m)
        print("15m Trend:", trend_15m)

        # ----------------------------------------
        # Multi Timeframe Filter
        # ----------------------------------------

        filter_result = self.filter.evaluate(
        trend_1m,
        trend_5m,
        trend_15m
        )
        allowed = filter_result["allowed"]

        print("----------------------------------------")
        print("Trade Allowed :", allowed)
        print("Reason        :", filter_result["reason"])

        if not allowed:

            print("❌ Blocked by Multi-Timeframe Filter")

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

                reasons=[
                    filter_result["reason"]
                ]

            )
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
                    reasons=[str(e)]

                )

        print("----------------------------------------")
        print("Indicator Result")
        print("----------------------------------------")
        print(indicator_result)

        # ----------------------------------------
        # Support & Resistance
        # ----------------------------------------

        self.support.analyze(
            market.candles
        )

        print("----------------------------------------")
        print("Support / Resistance Updated")
        print("----------------------------------------")


        # =====================================================
        # PART 2 STARTS HERE
        # =====================================================

        # ----------------------------------------
        # Analyze Market
        # ----------------------------------------

        signal = self.strategy.analyze(
            market,
            indicator_result
        )

        # ----------------------------------------
        # Signal Lock
        # ----------------------------------------

        if self.signal_lock.is_locked():

            locked = self.signal_lock.current()

            if locked is not None:

                print("----------------------------------------")
                print("🔒 SIGNAL IS LOCKED")
                print("----------------------------------------")
                print("Current Bias :", signal.bias)
                print("Locked Bias  :", locked.bias)
                print("Locked State :", locked.market_state)
                print("----------------------------------------")

                # Keep only the workflow state.
                # Never overwrite the newly analyzed bias.
                signal.market_state = locked.market_state
        # ----------------------------------------
        # Save Market Regime
        # ----------------------------------------

        signal.reasons.extend(regime.reasons)

        # Only if Signal has a regime field
        signal.regime = regime.regime
    
        # ----------------------------------------
        # AI Confidence Engine
        # ----------------------------------------

        signal.confidence = self.confidence.calculate(signal)
        # ----------------------------------------
        # Probability Engine
        # ----------------------------------------

        signal.probability = self.probability.calculate(

        signal,

        indicator_result.mode

        )

        print("----------------------------------------")
        print("Probability Engine")
        print("----------------------------------------")
        print("Probability :", signal.probability)
        print("----------------------------------------")
        # ----------------------------------------
        # Confidence Cap by Mode
        # ----------------------------------------

        caps = {

             "STARTUP": 70,

             "STANDARD": 80,

             "ADVANCED": 90,

             "FULL": 100

            }

        max_confidence = caps.get(

            indicator_result.mode,

            70

        )

        if signal.confidence > max_confidence:

          signal.confidence = max_confidence

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
        signal.entry_price = market.candles[-1].close
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
        
        state = self.entry_manager.determine(signal)

        self.entry_engine.confirm(signal,state)

        signal.market_state = state.value

        signal = self.presentation.build(signal)
        
        print("ENTRY STATE :", state)

        
        # ----------------------------------------
        # Lock Signal
        # ----------------------------------------

        if (
           state == EntryState.WAITING_FOR_CANDLE_CLOSE
           and not self.signal_lock.is_locked()
         ):

            self.signal_lock.lock(signal)
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
        # Risk Manager Override
        # ----------------------------------------

        if not risk["allowed"]:

           signal.action = "WAIT"

           signal.market_state = EntryState.WAITING.value

           signal.can_enter = False

           signal.reasons.extend(

         risk["reasons"]

         )

        # ----------------------------------------
        # AI Explanation
        # ----------------------------------------

        formatted = self.ai.format(

        signal

        )

        # ----------------------------------------
        # Save Trade
        # ----------------------------------------

        if signal.can_enter:
           
            try:

                from uuid import uuid4

                from app.models.trade import Trade

                trade = Trade(

                    id=str(uuid4()),

                    asset=signal.asset,

                    timeframe=signal.timeframe,

                    action=signal.action,

                    confidence=signal.confidence,

                    probability=signal.probability,

                    session=signal.session,

                    regime=signal.regime,

                    indicator_mode=indicator_result.mode,

                    grade=signal.grade,

                    risk=signal.risk,

                    trend=signal.trend,

                    entry_price=signal.entry_price,

                    exit_price=None,

                    entry_time=datetime.now(),

                    exit_time=None,

                    expiration_seconds=60,

                    status="OPEN",

                    result="",

                    profit=0.0,

                    payout=0.0,

                    reasons=signal.reasons

                )

                self.trade_storage.add(trade)

                print("----------------------------------------")
                print("Trade Logged")
                print("----------------------------------------")
                print("Trade ID :", trade.id)
                print("Status   :", trade.status)

            except Exception as e:

                print("----------------------------------------")
                print("Trade Logger Error")
                print("----------------------------------------")
                print(e)

        # =====================================================
        # PART 3 STARTS HERE
        # =====================================================
        # ----------------------------------------
        # Final Signal Information
        # ----------------------------------------

        signal.asset = market.asset
        signal.timeframe = market.timeframe
        signal.entry_price = market.candles[-1].close
        signal.timestamp = datetime.now()

        if not signal.expiration:
            signal.expiration = "Next Candle"

        # ----------------------------------------
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