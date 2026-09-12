from app.timeframe.aggregator import TimeframeAggregator


class TimeframeBuilder:

    def __init__(self):

        self.aggregator = TimeframeAggregator()

    def build(self, candles):

        frames = {

            # Raw 10-second candles
            "10s": candles,

            # Aggregated candles
            "1m": self.aggregator.aggregate(candles, 1),

            "5m": self.aggregator.aggregate(candles, 5),

            "15m": self.aggregator.aggregate(candles, 15)

        }

        print()
        print("========================================")
        print("Built Timeframes")
        print("========================================")
        print("10s candles :", len(frames["10s"]))
        print("1m candles  :", len(frames["1m"]))
        print("5m candles  :", len(frames["5m"]))
        print("15m candles :", len(frames["15m"]))
        print("========================================")
        print()

        return frames