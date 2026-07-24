from app.models.market import MarketData
from app.models.indicator import IndicatorResult
from app.models.signal import Signal

from app.strategies.ema_strategy import EmaStrategy
from app.strategies.rsi_strategy import RsiStrategy
from app.strategies.macd_strategy import MacdStrategy
from app.strategies.candlestick_strategy import CandlestickStrategy
from app.strategies.scoring_strategy import ScoringStrategy


class StrategyService:

    def __init__(self):

        self.ema = EmaStrategy()

        self.rsi = RsiStrategy()

        self.macd = MacdStrategy()

        self.candles = CandlestickStrategy()

        self.scoring = ScoringStrategy()

    def analyze(
        self,
        market: MarketData,
        indicators: IndicatorResult
    ) -> Signal:

        ema_result = self.ema.analyze(indicators)

        rsi_result = self.rsi.analyze(indicators)

        macd_result = self.macd.analyze(indicators)

        candle_result = self.candles.analyze(market)

        final = self.scoring.calculate([

            ema_result,

            rsi_result,

            macd_result,

            candle_result

        ])

        return Signal(

            asset=market.asset,

            action=final["action"],

            confidence=float(final["confidence"]),

            trend=final["trend"],

            reasons=final["reasons"]

        )