from app.indicators.macd import calculate_macd


class MacdCache:

    def build(self, closes):

        macd = []

        signal = []

        histogram = []

        for i in range(len(closes)):

            data = closes[: i + 1]

            if len(data) >= 35:

                result = calculate_macd(data)

                macd.append(result["macd"])

                signal.append(result["signal"])

                histogram.append(result["histogram"])

            else:

                macd.append(None)

                signal.append(None)

                histogram.append(None)

        return macd, signal, histogram