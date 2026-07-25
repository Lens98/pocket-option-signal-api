from app.market_data.provider import MarketProvider
from app.services.trading_engine import TradingEngine
from app.backtesting.backtester import Backtester

market = MarketProvider().historical(
    "app/market_data/sample_data/EURUSD_M1.csv"
)

engine = TradingEngine()

backtester = Backtester()

result = backtester.run(
    market.candles,
    engine
)

print()

print("========== HISTORICAL BACKTEST ==========")

print("Trades:", len(result.trades))
print("Wins:", result.wins)
print("Losses:", result.losses)
print("Win Rate:", result.win_rate)
print("Profit:", result.total_profit)