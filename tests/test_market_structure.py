from app.market_structure.analyzer import MarketStructureAnalyzer
from app.models.candle import Candle

prices = [
    100,
    103,
    106,
    110,   # Swing High
    105,
    101,   # Swing Low
    107,
    113,   # Higher Swing High
    108,
    104,   # Higher Swing Low
    110,
    116    # New High (not yet confirmed)
]

candles = []

for i, price in enumerate(prices):

    candles.append(
        Candle(
            timestamp=str(i),
            open=price,
            high=price + 1,
            low=price - 1,
            close=price,
            volume=1000
        )
    )

analyzer = MarketStructureAnalyzer()

print(analyzer.analyze(candles))