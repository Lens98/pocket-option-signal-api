from app.database.learning_repository import LearningRepository


class LearningStorage:

    def __init__(self):

        self.repository = LearningRepository()

    # ========================================
    # Save Learning Record
    # ========================================

    def add(self, record):

        self.repository.add(record)

    # ========================================
    # Get All Records
    # ========================================

    def all(self):

        return self.repository.all()

    # ========================================
    # Asset History
    # ========================================

    def by_asset(self, asset):

        return self.repository.by_asset(asset)

    # ========================================
    # Regime History
    # ========================================

    def by_regime(self, regime):

        return self.repository.by_regime(regime)

    # ========================================
    # Session History
    # ========================================

    def by_session(self, session):

        return self.repository.by_session(session)

    # ========================================
    # Total Records
    # ========================================

    def count(self):

        return self.repository.count()

        # ========================================
    # Statistics
    # ========================================

    def asset_stats(self, asset):

        return self.repository.asset_stats(asset)

    def regime_stats(self, regime):

        return self.repository.regime_stats(regime)

    def session_stats(self, session):

        return self.repository.session_stats(session)

    def confidence_stats(self, minimum):

        return self.repository.confidence_stats(minimum)

    def mode_stats(self, mode):

        return self.repository.mode_stats(mode)
        # ========================================
    # Overall Statistics
    # ========================================

    def overall_stats(self):

        return self.repository.overall_stats()

    # ========================================
    # Recent Statistics
    # ========================================

    def recent_stats(self, limit=50):

        return self.repository.recent_stats(limit)
        # ========================================
    # Session Statistics
    # ========================================

    def session_stats(self, session):

        return self.repository.session_stats(session)
        # ========================================
    # EMA Statistics
    # ========================================

    def ema_stats(self):

        return self.repository.ema_stats()

    # ========================================
    # RSI Statistics
    # ========================================

    def rsi_stats(self):

        return self.repository.rsi_stats()

    # ========================================
    # MACD Statistics
    # ========================================

    def macd_stats(self):

        return self.repository.macd_stats()

    # ========================================
    # ADX Statistics
    # ========================================

    def adx_stats(self):

        return self.repository.adx_stats()

    # ========================================
    # ATR Statistics
    # ========================================

    def atr_stats(self):

        return self.repository.atr_stats()