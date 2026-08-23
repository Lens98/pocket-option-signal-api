from app.models.market import MarketData


class MarketStorage:

    def __init__(self):

        # Structure:
        #
        # {
        #     user_id: {
        #         asset: [
        #             candle,
        #             candle
        #         ]
        #     }
        # }

        self.markets = {}

    # ----------------------------------------
    # UPDATE MARKET FOR ONE USER
    # ----------------------------------------

    def update(self, user_id: str, market: MarketData):

        asset = market.asset

        # Create user storage if needed

        if user_id not in self.markets:

            self.markets[user_id] = {}

        user_markets = self.markets[user_id]

        # Create asset history if needed

        if asset not in user_markets:

            user_markets[asset] = []

        history = user_markets[asset]

        # ----------------------------------------
        # Existing timestamps
        # ----------------------------------------

        existing = {str(candle.timestamp) for candle in history}

        print("----------------------------------------")
        print("User ID          :", user_id)
        print("Asset            :", asset)
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

            if ts == "" or ts.lower() == "undefined" or ts.lower() == "none":

                print("Ignoring invalid candle:", candle)

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
            key=lambda c: int(str(c.timestamp)) if str(c.timestamp).isdigit() else 0,
        )

        # ----------------------------------------
        # Keep latest 500 candles
        # ----------------------------------------

        if len(history) > 500:

            history = history[-500:]

        user_markets[asset] = history

        print("----------------------------------------")
        print("New Candles Added :", added)
        print("Ignored Candles   :", ignored)
        print("Stored History    :", len(history))
        print("----------------------------------------")

    # ----------------------------------------
    # GET MARKET FOR ONE USER
    # ----------------------------------------

    def get(self, user_id: str, asset: str):

        user_markets = self.markets.get(user_id, {})

        history = user_markets.get(asset, [])

        return MarketData(asset=asset, timeframe="10", candles=history)

    # ----------------------------------------
    # SIZE FOR ONE USER + ASSET
    # ----------------------------------------

    def size(self, user_id: str, asset: str):

        user_markets = self.markets.get(user_id, {})

        return len(user_markets.get(asset, []))

    # ----------------------------------------
    # RETURN HISTORY FOR ONE USER
    # ----------------------------------------

    def history(self, user_id: str, asset: str, limit=None):

        user_markets = self.markets.get(user_id, {})

        history = user_markets.get(asset, [])

        if limit is None:

            return history

        return history[-limit:]

    # ----------------------------------------
    # CLEAR ONE USER ASSET
    # ----------------------------------------

    def clear(self, user_id: str, asset: str):

        if user_id not in self.markets:

            return

        self.markets[user_id][asset] = []

    # ----------------------------------------
    # CLEAR ALL ASSETS FOR ONE USER
    # ----------------------------------------

    def clear_user(self, user_id: str):

        self.markets.pop(user_id, None)

    # ----------------------------------------
    # CLEAR EVERYTHING
    # ----------------------------------------

    def clear_all(self):

        self.markets.clear()
