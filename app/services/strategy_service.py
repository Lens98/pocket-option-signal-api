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

    def analyze(
        self,
        market: MarketData,
        indicators: IndicatorResult
    ) -> Signal:
        self.trade_state.analyzing()
        ema_result = self.ema.analyze(indicators)

        rsi_result = self.rsi.analyze(indicators)

        macd_result = self.macd.analyze(indicators)

        candle_result = self.candles.analyze(market)

        adx_result = self.adx.analyze(indicators)

        atr_result = self.atr.analyze(indicators)

        structure = self.structure.analyze(
            market.candles
        )

        market_structure_result = self.market_structure.analyze(
            structure
        )

        zone = self.zone_detector.analyze(
            market.candles
        )

        zone_result = self.supply_demand.analyze(
            zone
        )

        final = self.scoring.calculate([

            ema_result,

            rsi_result,

            macd_result,

            candle_result,

            adx_result,

            atr_result,

            market_structure_result,

            zone_result

        ])

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

    bias=final["action"],

    # =====================================
    # Current Action
    # (EntryManager will decide this later)
    # =====================================

    action="WAIT",

    # =====================================
    # AI Confidence
    # =====================================

    confidence=float(final["confidence"]),

    probability=0.0,

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

    trade_status="IDLE"

)

       
        if signal.action == "WAIT":

            self.trade_state.waiting()

        else:

          self.trade_state.ready()

        return signal