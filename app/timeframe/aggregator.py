from app.models.candle import Candle


class TimeframeAggregator:

    # Base candle size (seconds)
    BASE_SECONDS = 10

    def aggregate(self, candles, minutes):

        if not candles:
            return []

        candles_per_group = (minutes * 60) // self.BASE_SECONDS

        result = []

        print("----------------------------------------")
        print(f"Building {minutes}m timeframe")
        print("Input Candles :", len(candles))
        print("Candles/Group :", candles_per_group)
        print("----------------------------------------")

        for i in range(0, len(candles), candles_per_group):

            chunk = candles[i:i + candles_per_group]

            # Skip incomplete groups
            if len(chunk) < candles_per_group:
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

        print(f"{minutes}m candles built:", len(result))
        print("----------------------------------------")

        return result