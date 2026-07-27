from app.models.market import MarketData


class MarketStorage:

    def __init__(self):

        self.markets = {}

    def update(self, market: MarketData):

        asset = market.asset

        if asset not in self.markets:

            self.markets[asset] = []

        history = self.markets[asset]

        # ----------------------------------------
        # Existing timestamps
        # ----------------------------------------

        existing = {
            str(candle.timestamp)
            for candle in history
        }

        print("----------------------------------------")
        print("Existing Candles :", len(existing))
        print("Incoming Candles :", len(market.candles))
        print("----------------------------------------")

        added = 0
        ignored = 0

        # ----------------------------------------
        # Merge new candles
        # ----------------------------------------

        for candle in market.candles:

            ts = str(candle.timestamp).strip()

            # Skip invalid timestamps
            if (
                ts == ""
                or ts.lower() == "undefined"
                or ts.lower() == "none"
            ):
                print("⚠ Ignoring invalid candle:", candle)
                ignored += 1
                continue

            if ts not in existing:

                history.append(candle)
                existing.add(ts)
                added += 1

        # ----------------------------------------
        # Sort history safely
        # ----------------------------------------

        history = sorted(
            history,
            key=lambda c: int(str(c.timestamp))
            if str(c.timestamp).isdigit()
            else 0
        )

        # ----------------------------------------
        # Keep latest 500 candles
        # ----------------------------------------

        if len(history) > 500:
            history = history[-500:]

        self.markets[asset] = history

        print("----------------------------------------")
        print("New Candles Added :", added)
        print("Ignored Candles   :", ignored)
        print("Stored History    :", len(history))
        print("----------------------------------------")

    def get(self, asset):

        history = self.markets.get(asset, [])

        return MarketData(
            asset=asset,
            timeframe="10",
            candles=history
        )

    def size(self, asset):

        return len(
            self.markets.get(asset, [])
        )

    # ----------------------------------------
    # Return candle history
    # ----------------------------------------

    def history(self, asset, limit=None):

        history = self.markets.get(asset, [])

        if limit is None:
            return history

        return history[-limit:]

    # ----------------------------------------
    # Clear one asset
    # ----------------------------------------

    def clear(self, asset):

        self.markets[asset] = []

    # ----------------------------------------
    # Clear all assets
    # ----------------------------------------

    def clear_all(self):

        self.markets.clear()