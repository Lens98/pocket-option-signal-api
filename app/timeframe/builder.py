from app.timeframe.aggregator import TimeframeAggregator


class TimeframeBuilder:

    def build(self, candles):

        agg = TimeframeAggregator()

        return {

            "1m": candles,

            "5m": agg.aggregate(candles, 5),

            "15m": agg.aggregate(candles, 15)

        }