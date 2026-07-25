from app.models.candle import Candle


class TimeframeAggregator:

    def aggregate(self, candles, size):

        result = []

        for i in range(0, len(candles), size):

            chunk = candles[i:i + size]

            if len(chunk) < size:
                break

            result.append(

                Candle(

                    timestamp=chunk[0].timestamp,

                    open=chunk[0].open,

                    high=max(c.high for c in chunk),

                    low=min(c.low for c in chunk),

                    close=chunk[-1].close,

                    volume=sum(c.volume for c in chunk)

                )

            )

        return result