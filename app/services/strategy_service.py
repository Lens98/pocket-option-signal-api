from app.models.market import MarketData
from app.models.indicator import IndicatorResult
from app.models.signal import Signal
from app.services.trade_state import TradeStateManager
from app.supply_demand.zone_detector import SupplyDemandDetector

from app.strategies.supply_demand_strategy import SupplyDemandStrategy
from app.strategies.ema_strategy import EmaStrategy
from app.strategies.rsi_strategy import RsiStrategy
from app.strategies.macd_strategy import MacdStrategy
from app.strategies.candlestick_strategy import CandlestickStrategy
from app.strategies.adx_strategy import AdxStrategy
from app.strategies.atr_strategy import AtrStrategy
from app.strategies.market_structure_strategy import MarketStructureStrategy
from app.strategies.scoring_strategy import ScoringStrategy

from app.market_structure.analyzer import MarketStructureAnalyzer


class StrategyService:

    def __init__(self):

        self.ema = EmaStrategy()
        self.rsi = RsiStrategy()
        self.macd = MacdStrategy()
        self.candles = CandlestickStrategy()
        self.adx = AdxStrategy()
        self.atr = AtrStrategy()
        self.trade_state = TradeStateManager()
        self.market_structure = MarketStructureStrategy()
        self.structure = MarketStructureAnalyzer()

        self.scoring = ScoringStrategy()

        self.zone_detector = SupplyDemandDetector()
        self.supply_demand = SupplyDemandStrategy()

    def analyze(self, market: MarketData, indicators: IndicatorResult) -> Signal:
        self.trade_state.analyzing()
        ema_result = self.ema.analyze(indicators)

        rsi_result = self.rsi.analyze(indicators)

        macd_result = self.macd.analyze(indicators)

        candle_result = self.candles.analyze(market)

        adx_result = self.adx.analyze(indicators)

        atr_result = self.atr.analyze(indicators)

        structure = self.structure.analyze(market.candles)

        market_structure_result = self.market_structure.analyze(structure)

        zone = self.zone_detector.analyze(market.candles)

        zone_result = self.supply_demand.analyze(zone)

        final = self.scoring.calculate(
            [
                ema_result,
                rsi_result,
                macd_result,
                candle_result,
                adx_result,
                atr_result,
                market_structure_result,
                zone_result,
            ]
        )

        signal = Signal(
            # =====================================
            # Market
            # =====================================
            asset=market.asset,
            timeframe=market.timeframe,
            session="UNKNOWN",
            # =====================================
            # Market Direction
            # =====================================
            bias=final["bias"],
            # =====================================
            # Current Action
            # (EntryManager will decide this later)
            # =====================================
            action=final["action"],
            # =====================================
            # AI Confidence
            # =====================================
            confidence=float(final["confidence"]),
            probability=float(final["probability"]),
            trend=final["trend"],
            regime="UNKNOWN",
            expiration="Next Candle",
            # =====================================
            # Price
            # =====================================
            entry_price=market.candles[-1].close,
            timestamp=None,
            # =====================================
            # Risk
            # =====================================
            risk="UNKNOWN",
            grade="N/A",
            # =====================================
            # AI Explanation
            # =====================================
            reasons=final["reasons"],
            # =====================================
            # Entry Manager
            # =====================================
            market_state="WAITING",
            can_enter=False,
            entry_window=0,
            countdown=0,
            trade_status="IDLE",
        )
        # =====================================
        # Entry Confirmations (Bias Aware)
        # =====================================

        if signal.bias == "CALL":

            signal.ema_confirmed = ema_result.bullish_score > ema_result.bearish_score

            signal.macd_confirmed = (
                macd_result.bullish_score > macd_result.bearish_score
            )

            signal.rsi_confirmed = rsi_result.bullish_score > rsi_result.bearish_score

            signal.structure_confirmed = (
                market_structure_result.bullish_score
                > market_structure_result.bearish_score
            )

            signal.zone_confirmed = (
                zone_result.bullish_score > zone_result.bearish_score
            )

            # ADX and ATR measure strength, not direction.
            # Keep them true whenever they contribute any score.

            signal.adx_confirmed = False
            signal.atr_confirmed = False
            signal.candle_confirmed = (
                candle_result.bullish_score > candle_result.bearish_score
            )

        elif signal.bias == "PUT":

            signal.ema_confirmed = ema_result.bearish_score > ema_result.bullish_score

            signal.macd_confirmed = (
                macd_result.bearish_score > macd_result.bullish_score
            )

            signal.rsi_confirmed = rsi_result.bearish_score > rsi_result.bullish_score

            signal.structure_confirmed = (
                market_structure_result.bearish_score
                > market_structure_result.bullish_score
            )

            signal.zone_confirmed = (
                zone_result.bearish_score > zone_result.bullish_score
            )

            signal.adx_confirmed = False
            signal.atr_confirmed = False

            signal.candle_confirmed = (
                candle_result.bearish_score > candle_result.bullish_score
            )

        else:

            signal.ema_confirmed = False
            signal.macd_confirmed = False
            signal.rsi_confirmed = False
            signal.structure_confirmed = False
            signal.zone_confirmed = False
            signal.adx_confirmed = False
            signal.atr_confirmed = False
            signal.candle_confirmed = False

        # =====================================
        # Pullback Detector
        # =====================================

        from app.entry.pullback_detector import PullbackDetector

        pullback = PullbackDetector()

        signal.pullback_confirmed = pullback.confirm(market, indicators, signal.bias)

        # =====================================
        # Debug
        # =====================================

        print()
        print("========================================")
        print("ENTRY CONFIRMATIONS")
        print("========================================")
        print("Bias       :", signal.bias)
        print("EMA        :", signal.ema_confirmed)
        print("MACD       :", signal.macd_confirmed)
        print("RSI        :", signal.rsi_confirmed)
        print("Structure  :", signal.structure_confirmed)
        print("Zone       :", signal.zone_confirmed)
        print("ADX        :", signal.adx_confirmed)
        print("ATR        :", signal.atr_confirmed)
        print("Candle     :", signal.candle_confirmed)
        print("Pullback   :", signal.pullback_confirmed)
        print("========================================")
        print()

        if signal.action == "WAIT":

            self.trade_state.waiting()

        else:

            self.trade_state.ready()

        return signal
