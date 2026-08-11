from datetime import datetime
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
        self.presentation = PresentationBuilder()   # ⭐ NEW
        self.risk = RiskManager()

        # ----------------------------------------
        # Support / Resistance
        # ----------------------------------------

        self.support = SupportResistance()
        # ----------------------------------------
        # Candle Tracking
        # ----------------------------------------

        self.last_candle_timestamp = None

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

    def generate_signal(
        self,
        market,
        indicator_result=None
    ):

        # ----------------------------------------
        # ACTIVE TRADE LOCK
        # ----------------------------------------
        # Never generate a new signal while an
        # existing trade is still active.

        if self.signal_lock.is_trade_locked():

            locked = self.signal_lock.current()
           
            print("----------------------------------------")
            print("🔒 ACTIVE TRADE LOCKED")
            print("----------------------------------------")

            print("Trade ID :", self.signal_lock.trade_id)
            print("Asset    :", locked.asset)
            print("Bias     :", locked.bias)
            print("Action   :", locked.action)
            print("State    :", locked.market_state)


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

        if 'regime' not in locals():

            regime = self.market_regime.detect(
                indicator_result
            )

        # ----------------------------------------
        # Analyze Market
        # ----------------------------------------

        signal = self.strategy.analyze(
            market,
            indicator_result
        ) 
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
        agreement = self.agreement.calculate(signal)
        market_quality = self.market_quality.calculate(signal)


        signal.agreement_score = (
        agreement["agreement"]
        )


        signal.confirmation_count = (
         agreement["confirmations"]
        )


        signal.confirmation_total = (
        agreement["total"]
        )
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
        #AI ANALYSIS DATA FOR DASHBOARD
        # ========================================

        signal.ema_status = (
             "✓ Active"
             if indicator_result.ema20 is not None
             else "--"
         )

        signal.ema_strength = (
            "Startup"
            if indicator_result.ema50 is None
            else "Strong"
        )


        signal.rsi_status = (
             "✓ Momentum"
             if indicator_result.rsi is not None
            else "--"
        )

        signal.rsi_strength = (
            "Strong"
            if indicator_result.rsi is not None
            else "--"
        )


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
                "Strong"
               if indicator_result.histogram > 0
             else "Weak"
         )

        signal.structure_status = (
            "✓ Confirmed"
            if signal.structure_confirmed
            else "--"
        )

        signal.structure_strength = (
            "Strong"
            if signal.structure_confirmed
            else "--"
        )


        signal.volatility_status = (
            "✓ Active"
           if indicator_result.atr is not None
          else "UNKNOWN"
        )

        signal.volatility_strength = (
           "Strong"
           if indicator_result.atr is not None
           else "--"
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
        signal.probability = self.probability.calculate(
        
                signal,
        
                indicator_result.mode
        
                )

        signal.confidence = self.confidence.calculate(

            signal,

            agreement_score=signal.agreement_score,

           market_quality=market_quality,

           learning_score=signal.probability

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
        

      # ----------------------------------------
      # Waiting-for-candle lock
      # ----------------------------------------

        if self.signal_lock.is_locked():
  
          locked = self.signal_lock.current()


          print("----------------------------------------")
          print("🔒 USING LOCKED SIGNAL")
          print("----------------------------------------")

          state = EntryState(locked.market_state)

          signal = locked

        else:

         state = self.entry_manager.determine(signal)
        # ----------------------------------------
        # Lock Signal
        # ----------------------------------------

        if (
           state == EntryState.WAITING_FOR_CANDLE_CLOSE
           and not self.signal_lock.is_locked()
        ):

            self.signal_lock.lock(

            signal,

        reason="WAITING FOR NEW CANDLE"

          )

        # ----------------------------------------
        # Detect New Candle
        # ----------------------------------------

        latest_candle = market.candles[-1]

        if self.last_candle_timestamp is None:

           self.last_candle_timestamp = latest_candle.timestamp

        elif latest_candle.timestamp != self.last_candle_timestamp:

            print("========================================")
            print("🟢 NEW CANDLE OPENED")
            print("Previous :", self.last_candle_timestamp)
            print("Current  :", latest_candle.timestamp)
            print("========================================")

            self.last_candle_timestamp = latest_candle.timestamp

            locked = None

            if self.signal_lock.is_locked():

             # Save the locked signal FIRST
             locked = self.signal_lock.current()

            # Now unlock
            self.signal_lock.unlock()

            if locked is not None:

                print("----------------------------------------")
                print("✅ CANDLE CLOSED")
                print("FINAL CONFIRMATION")
                print("----------------------------------------")

                signal = locked

                print("Locked Bias   :", signal.bias)
                print("Locked Action :", signal.action)
                print("Confidence    :", signal.confidence)
                print("Probability   :", signal.probability)
                print("Candle Pattern:", signal.candle_pattern)
                print("Candle Strength:", signal.candle_strength)

                print("----------------------------------------")
                print("🎯 CANDLE CLOSED - FINAL SIGNAL")
                print("----------------------------------------")

                candidate_action = signal.bias

                print("Candidate :", candidate_action)
                print("Pattern   :", signal.candle_pattern)
                print("Strength  :", signal.candle_strength)
                print("Confidence:", signal.confidence)
                print("Agreement :", signal.agreement_score)
                print("Confirmations:",
                    f"{signal.confirmation_count}/{signal.confirmation_total}")

                if candidate_action in ["CALL", "PUT"]:

                    signal.action = candidate_action
                    signal.market_state = EntryState.ENTRY.value
                    signal.can_enter = True

                    state = EntryState.ENTRY

                    print("----------------------------------------")
                    print("✅ FINAL CONFIRMATION PASSED")
                    print("----------------------------------------")
                    print("FINAL ACTION :", signal.action)
                    print("🚀 ENTER NEXT CANDLE")
                    print("----------------------------------------")

                else:

                       signal.action = "WAIT"
                       signal.can_enter = False
                       signal.market_state = EntryState.WAITING.value

                       state = EntryState.ANALYZING

                       print("----------------------------------------")
                       print("❌ FINAL CONFIRMATION FAILED")
                       print("----------------------------------------")           

                    
            else:

                    signal.action = "WAIT"
                    signal.can_enter = False
                    signal.market_state = EntryState.WAITING.value

                    state = EntryState.ANALYZING
 
          
              

        # ----------------------------------------
        # Confirm Entry
        # ----------------------------------------

        signal.market_state = state.value

        self.entry_engine.confirm(
           signal,
           state
        )

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
        # Risk Manager Override
        # ----------------------------------------

        if not risk["allowed"] and state != EntryState.ENTRY:

            signal.action = "WAIT"

            signal.market_state = EntryState.WAITING.value

            signal.can_enter = False

            signal.reasons.extend(risk["reasons"])

        if filter_block_reason and state != EntryState.ENTRY:

           signal.action = "WAIT"

           signal.can_enter = False

           signal.reasons.append(filter_block_reason)

        # ----------------------------------------
        # AI Explanation
        # ----------------------------------------

        formatted = self.ai.format(

        signal

        )

        # ----------------------------------------
        # Save Trade
        # ----------------------------------------
        if signal.action == "WAIT":

            print("❌ BLOCKED: WAIT signal cannot create trade")

            signal.can_enter = False

        # ========================================
        # Minimum Confidence Filter
        # ========================================

        MIN_CONFIDENCE = 70

        if (
            signal.can_enter
            and signal.confidence < MIN_CONFIDENCE
        ):
            print("----------------------------------------")
            print("❌ BLOCKED: Confidence too low")
            print("Confidence :", signal.confidence)
            print("Minimum    :", MIN_CONFIDENCE)
            print("----------------------------------------")

            signal.action = "WAIT"
            signal.can_enter = False
            signal.market_state = EntryState.WAITING.value
            signal.reasons.append(
                f"Confidence below {MIN_CONFIDENCE}%"
            )

   
        # ========================================
        # TRADE CREATION CHECK
        # ========================================

        if (
           signal.can_enter
           and signal.action in ["CALL", "PUT"]
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

               print("🛑 TRADE CREATION BLOCKED")
               print("An OPEN trade already exists.")
               print("Trade ID :", existing.id)
               print("Asset    :", existing.asset)
               print("Action   :", existing.action)
               print("Status   :", existing.status)
               print("----------------------------------------")

               signal.action = "WAIT"
               signal.can_enter = False
               signal.market_state = EntryState.WAITING.value
               signal.reason = "OPEN_TRADE_EXISTS"
               signal.instruction = (
                   "A trade is already active. "
                   "Wait for it to finish."
                )

          else:

              print("✅ NO OPEN TRADE")
              print("Creating new trade...")
              print("----------------------------------------")
 
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
              # Create Trade
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
                     entry_time=datetime.now(),
                     exit_time=None,
                     expiration_seconds=60,
                     status="OPEN",
                     result="",
                     profit=0.0,
                     payout=0.0,
                     reasons=signal.reasons,
                     pattern=signal.pattern
                )

                 self.trade_storage.add(trade)

                 print("----------------------------------------")
                 print("🚀 TRADE CREATED")
                 print("----------------------------------------")
                 print("Trade ID :", trade.id)
                 print("Asset    :", trade.asset)
                 print("Action   :", trade.action)
                 print("Entry    :", trade.entry_price)
                 print("Expiration: 60 seconds")
                 print("Status   :", trade.status)
                 print("----------------------------------------")

                 # ----------------------------------------
                 # Lock Active Trade
                 # ----------------------------------------

                 self.signal_lock.lock(
                      signal,
                      reason="ACTIVE",
                      trade_id=trade.id
                )

                 self.signal_lock.activate(
                     trade.id
                )

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
                 print("Trade Logger Error")
                 print("----------------------------------------")
                 print(e)
                 print("----------------------------------------")
        

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