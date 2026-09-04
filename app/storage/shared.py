from app.storage.market_storage import MarketStorage
from app.storage.signal_storage import SignalStorage
from app.storage.trade_storage import TradeStorage
from app.storage.active_asset import ActiveAsset
from app.services.trade_state import TradeStateManager
from app.services.signal_lock import SignalLock

market_storage = MarketStorage()

signal_storage = SignalStorage()

trade_storage = TradeStorage()

trade_state = TradeStateManager()

active_asset = ActiveAsset()

signal_lock = SignalLock()
