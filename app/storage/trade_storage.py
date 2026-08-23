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

    def find(self, trade_id):

        return self.repository.find(trade_id)

    # ----------------------------------------
    # Latest Trade
    # ----------------------------------------

    def latest(self):

        return self.repository.latest()

    # ----------------------------------------
    # All Trades
    # ----------------------------------------

    def all(self):

        return self.repository.all()

    # ----------------------------------------
    # Update Trade
    # ----------------------------------------

    def update(self, trade):

        self.repository.update(trade)

    # ----------------------------------------
    # Count
    # ----------------------------------------

    def count(self):

        return self.repository.count()

    # ----------------------------------------
    # Open Trades
    # ----------------------------------------

    def open_trades(self):

        return self.repository.open_trades()

    # ----------------------------------------
    # Closed Trades
    # ----------------------------------------

    def closed_trades(self):

        return self.repository.closed_trades()

    # ----------------------------------------
    # Statistics
    # ----------------------------------------

    def statistics(self):

        return self.repository.statistics()

    # ----------------------------------------
    # Today's Statistics
    # ----------------------------------------

    def today_statistics(self):

        return self.repository.today_statistics()

    # ----------------------------------------
    # Win Count
    # ----------------------------------------

    def win_count(self):

        return self.repository.win_count()

    # ----------------------------------------
    # Loss Count
    # ----------------------------------------

    def loss_count(self):

        return self.repository.loss_count()

    # ----------------------------------------
    # Draw Count
    # ----------------------------------------

    def draw_count(self):

        return self.repository.draw_count()

    # ----------------------------------------
    # Win Rate
    # ----------------------------------------

    def win_rate(self):

        return self.repository.win_rate()
