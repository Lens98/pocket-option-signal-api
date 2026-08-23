from app.indicators.rsi import calculate_rsi


class RsiCache:

    def build(self, closes):

        values = []

        for i in range(len(closes)):

            data = closes[: i + 1]

            if len(data) >= 15:
                values.append(calculate_rsi(data))
            else:
                values.append(None)

        return values
        