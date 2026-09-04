from app.database.trade_repository import TradeRepository


class TradeStorage:

    def __init__(self):

        self.repository = TradeRepository()

    # ----------------------------------------
    # Save Trade
    # ----------------------------------------

    def add(self, trade):

        self.repository.add(trade)

    # ----------------------------------------
    # Find Trade
    # ----------------------------------------

    def find(self, trade_id, user_id=None):

        return self.repository.find(trade_id, user_id)

    # ----------------------------------------
    # Latest Trade
    # ----------------------------------------

    def latest(self, user_id=None):

        return self.repository.latest(user_id)

    # ----------------------------------------
    # All Trades
    # ----------------------------------------

    def all(self, user_id=None):

        return self.repository.all(user_id)

    # ----------------------------------------
    # Update Trade
    # ----------------------------------------

    def update(self, trade):

        self.repository.update(trade)

    # ----------------------------------------
    # Count
    # ----------------------------------------

    def count(self, user_id=None):

        return self.repository.count(user_id)

    # ----------------------------------------
    # Open Trades
    # ----------------------------------------

    def open_trades(self, user_id=None):

        return self.repository.open_trades(user_id)

    # ----------------------------------------
    # Closed Trades
    # ----------------------------------------

    def closed_trades(self, user_id=None):

        return self.repository.closed_trades(user_id)

    # ----------------------------------------
    # Statistics
    # ----------------------------------------

    def statistics(self, user_id=None):

        return self.repository.statistics(user_id)

    # ----------------------------------------
    # Today's Statistics
    # ----------------------------------------

    def today_statistics(self, user_id=None):

        return self.repository.today_statistics(user_id)

    # ----------------------------------------
    # Win Count
    # ----------------------------------------

    def win_count(self, user_id=None):

        return self.repository.win_count(user_id)

    # ----------------------------------------
    # Loss Count
    # ----------------------------------------

    def loss_count(self, user_id=None):

        return self.repository.loss_count(user_id)

    # ----------------------------------------
    # Draw Count
    # ----------------------------------------

    def draw_count(self, user_id=None):

        return self.repository.draw_count(user_id)

    # ----------------------------------------
    # Win Rate
    # ----------------------------------------

    def win_rate(self, user_id=None):

        return self.repository.win_rate(user_id)
