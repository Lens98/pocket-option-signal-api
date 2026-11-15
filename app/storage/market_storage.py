
from app.models.market import MarketData


class MarketStorage:

    def __init__(self):
        self.markets = {}
        self.timeframes = {}

    # UPDATE MARKET FOR ONE USER
    def update(self, user_id: str, market: MarketData):

        asset = market.asset

        if user_id not in self.timeframes:
            self.timeframes[user_id] = {}

        self.timeframes[user_id][asset] = market.timeframe

        if user_id not in self.markets:
            self.markets[user_id] = {}

        user_markets = self.markets[user_id]

        if asset not in user_markets:
            user_markets[asset] = []

        history = user_markets[asset]

        candle_map = {}

        for candle in history:
            ts = str(candle.timestamp).strip()

            if ts == "" or ts.lower() in ("undefined", "none"):
                continue

            candle_map[ts] = candle

        print("----------------------------------------")
        print("User ID          :", user_id)
        print("Asset            :", asset)
        print("Existing Candles :", len(candle_map))
        print("Incoming Candles :", len(market.candles))
        print("----------------------------------------")

        added = 0
        updated = 0
        ignored = 0

        for candle in market.candles:
            ts = str(candle.timestamp).strip()

            if ts == "" or ts.lower() in ("undefined", "none"):
                print("Ignoring invalid candle:", candle)
                ignored += 1
                continue

            if ts in candle_map:
                candle_map[ts] = candle
                updated += 1
            else:
                candle_map[ts] = candle
                added += 1

        history = sorted(
            candle_map.values(),
            key=lambda c: (
                int(str(c.timestamp)) if str(c.timestamp).isdigit() else 0
            ),
        )

        if len(history) > 500:
            history = history[-500:]

        user_markets[asset] = history

        print("----------------------------------------")
        print("New Candles Added :", added)
        print("Candles Updated   :", updated)
        print("Ignored Candles   :", ignored)
        print("Stored History    :", len(history))
        print("----------------------------------------")

    # GET MARKET FOR ONE USER
    def get(self, user_id: str, asset: str):

        user_markets = self.markets.get(user_id, {})
        history = user_markets.get(asset, [])

        timeframe = self.timeframes.get(user_id, {}).get(asset, "10")

        return MarketData(
            asset=asset,
            timeframe=timeframe,
            candles=history,
        )

    # SIZE FOR ONE USER + ASSET
    def size(self, user_id: str, asset: str):

        user_markets = self.markets.get(user_id, {})
        return len(user_markets.get(asset, []))

    # RETURN HISTORY FOR ONE USER
    def history(self, user_id: str, asset: str, limit=None):

        user_markets = self.markets.get(user_id, {})
        history = user_markets.get(asset, [])

        if limit is None:
            return history

        return history[-limit:]

    # CLEAR ONE USER ASSET
    def clear(self, user_id: str, asset: str):

        if user_id not in self.markets:
            return

        self.markets[user_id][asset] = []

        if user_id in self.timeframes:
            self.timeframes[user_id].pop(asset, None)

    # CLEAR ALL ASSETS FOR ONE USER
    def clear_user(self, user_id: str):

        self.markets.pop(user_id, None)
        self.timeframes.pop(user_id, None)

    # CLEAR EVERYTHING
    def clear_all(self):

        self.markets.clear()
        self.timeframes.clear()
