from datetime import datetime

from app.services.indicator_service import IndicatorService
from app.services.strategy_service import StrategyService
from app.support_resistance.support_resistance import SupportResistance
from app.risk.risk_manager import RiskManager

from app.timeframe.builder import TimeframeBuilder
from app.timeframe.trend import TrendAnalyzer
from app.timeframe.filter import MultiTimeframeFilter

from app.models.market import MarketData
from app.models.signal import Signal


class TradingEngine:

    def __init__(self):

        self.indicators = IndicatorService()
        self.strategy = StrategyService()
        self.support = SupportResistance()
        self.risk = RiskManager()

        self.timeframes = TimeframeBuilder()
        self.trend = TrendAnalyzer()
        self.filter = MultiTimeframeFilter()

    def generate_signal(
        self,
        market,
        indicator_result=None
    ):

        print("\n========================================")
        print("🚀 NEW MARKET UPDATE")
        print("========================================")
        print("Asset:", market.asset)
        print("Timeframe:", market.timeframe)
        print("Candles Received:", len(market.candles))
        print("========================================")

        # ----------------------------
        # Build Higher Timeframes
        # ----------------------------

        frames = self.timeframes.build(market.candles)

        print("Built Timeframes")
        print("5m candles :", len(frames["5m"]))
        print("15m candles:", len(frames["15m"]))

        trend_5m = self.trend.analyze(
            MarketData(
                asset=market.asset,
                timeframe="5m",
                candles=frames["5m"]
            )
        )

        trend_15m = self.trend.analyze(
            MarketData(
                asset=market.asset,
                timeframe="15m",
                candles=frames["15m"]
            )
        )

        print("----------------------------------------")
        print("5m Trend :", trend_5m)
        print("15m Trend:", trend_15m)

        # ----------------------------
        # Multi-Timeframe Filter
        # ----------------------------

        allowed = self.filter.allow_trade(
            trend_5m,
            trend_15m
        )

        print("----------------------------------------")
        print("Trade Allowed:", allowed)

        if not allowed:

            print("❌ Blocked by Multi-Timeframe Filter")

            return Signal(
                asset=market.asset,
                timeframe=market.timeframe,
                action="WAIT",
                confidence=0.0,
                trend="SIDEWAYS",
                expiration="Next Candle",
                entry_price=market.candles[-1].close,
                timestamp=datetime.now(),
                risk="HIGH",
                reasons=[
                    "5m and 15m trend mismatch"
                ]
            )

        # ----------------------------
        # Indicators
        # ----------------------------

        if indicator_result is None:

            indicator_result = self.indicators.calculate(market)

        print("----------------------------------------")
        print("Indicator Result:")
        print(indicator_result)

        self.support.analyze(market.candles)

        # ----------------------------
        # Strategy
        # ----------------------------

        signal = self.strategy.analyze(
            market=market,
            indicators=indicator_result
        )

        print("----------------------------------------")
        print("Strategy Output:")
        print(signal)

        # ----------------------------
        # Complete Signal
        # ----------------------------

        signal.timeframe = market.timeframe
        signal.expiration = "Next Candle"
        signal.entry_price = market.candles[-1].close
        signal.timestamp = datetime.now()

        # ----------------------------
        # Risk Manager
        # ----------------------------

        risk = self.risk.evaluate(signal)

        print("----------------------------------------")
        print("Risk Result:")
        print(risk)

        signal.risk = risk["risk"]

        if not risk["allowed"]:

            signal.action = "WAIT"
            signal.reasons.extend(risk["reasons"])

        print("\n========================================")
        print("✅ FINAL SIGNAL")
        print("========================================")
        print(signal)
        print("========================================\n")

        return signal