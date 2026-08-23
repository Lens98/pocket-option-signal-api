from app.support_resistance.support_resistance import SupportResistance
from app.models.candle import Candle

candles = []

price = 100

for i in range(50):

    candles.append(
        Candle(
            timestamp=str(i),
            open=price,
            high=price + 1,
            low=price - 1,
            close=price + 0.5,
            volume=1000
        )
    )

    if i % 5 == 0:
        price += 3
    else:
        price -= 1

engine = SupportResistance()

result = engine.analyze(candles)

print(result)