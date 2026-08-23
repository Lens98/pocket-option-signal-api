from app.indicators.ema import calculate_ema


class EmaCache:

    def build(self, closes):

        ema20 = []

        ema50 = []

        ema200 = []

        for i in range(len(closes)):

            data = closes[: i + 1]

            if len(data) >= 20:
                ema20.append(calculate_ema(data, 20))
            else:
                ema20.append(None)

            if len(data) >= 50:
                ema50.append(calculate_ema(data, 50))
            else:
                ema50.append(None)

            if len(data) >= 200:
                ema200.append(calculate_ema(data, 200))
            else:
                ema200.append(None)

        return ema20, ema50, ema200