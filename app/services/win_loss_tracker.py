from datetime import datetime

from app.storage.trade_storage import TradeStorage


class WinLossTracker:

    def __init__(self):

        self.storage = TradeStorage()

    # ----------------------------------------
    # Close Trade
    # ----------------------------------------

    def close_trade(
        self,
        trade,
        exit_price,
        payout=0.80
    ):

        trade.exit_price = exit_price
        trade.exit_time = datetime.now()
        trade.status = "CLOSED"

        duration = (
            trade.exit_time - trade.entry_time
        ).total_seconds()

        # ----------------------------------------
        # CALL
        # ----------------------------------------

        if trade.action == "CALL":

            if exit_price > trade.entry_price:

                trade.result = "WIN"
                trade.profit = payout

            elif exit_price < trade.entry_price:

                trade.result = "LOSS"
                trade.profit = -1.0

            else:

                trade.result = "DRAW"
                trade.profit = 0.0

        # ----------------------------------------
        # PUT
        # ----------------------------------------

        elif trade.action == "PUT":

            if exit_price < trade.entry_price:

                trade.result = "WIN"
                trade.profit = payout

            elif exit_price > trade.entry_price:

                trade.result = "LOSS"
                trade.profit = -1.0

            else:

                trade.result = "DRAW"
                trade.profit = 0.0

        # ----------------------------------------
        # Unknown Action
        # ----------------------------------------

        else:

            trade.result = "INVALID"
            trade.profit = 0.0

        trade.payout = payout

        # ----------------------------------------
        # Save to SQLite
        # ----------------------------------------

        self.storage.update(trade)

        # ----------------------------------------
        # Console
        # ----------------------------------------

        print()
        print("========================================")
        print("🏁 TRADE CLOSED")
        print("========================================")
        print("ID         :", trade.id)
        print("Asset      :", trade.asset)
        print("Action     :", trade.action)
        print("Entry      :", trade.entry_price)
        print("Exit       :", trade.exit_price)
        print("Result     :", trade.result)
        print("Profit     :", trade.profit)
        print("Payout     :", trade.payout)
        print("Duration   :", f"{duration:.0f} sec")
        print("Status     :", trade.status)
        print("========================================")
        print()

        return trade

    # ----------------------------------------
    # Close Trade by ID
    # ----------------------------------------

    def update_trade(
        self,
        trade_id,
        exit_price,
        payout=0.80
    ):

        trade = self.storage.find(trade_id)

        if trade is None:

            return None

        return self.close_trade(
            trade,
            exit_price,
            payout
        )