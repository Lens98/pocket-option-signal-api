from app.market_structure.analyzer import MarketStructureAnalyzer
from app.models.candle import Candle

candles = [
    Candle(timestamp="1", open=100, high=101, low=99, close=100, volume=100),
    Candle(timestamp="2", open=100, high=103, low=99, close=102, volume=100),
    Candle(timestamp="3", open=102, high=104, low=101, close=103, volume=100),
    Candle(timestamp="4", open=103, high=105, low=102, close=106, volume=100),  # closes above previous swing
]

analyzer = MarketStructureAnalyzer()

print(analyzer.analyze(candles))