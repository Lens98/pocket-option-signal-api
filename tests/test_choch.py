from app.market_structure.analyzer import MarketStructureAnalyzer
from app.models.candle import Candle

prices = [
    100,
    103,
    106,
    110,
    107,
    104,
    101,
    98,
    95,
    92,
    90
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

result = analyzer.analyze(candles)

print()
print("========== CHoCH TEST ==========")
print(result)