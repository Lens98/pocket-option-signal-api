from app.models.indicator import IndicatorResult
from app.models.signal import Signal
from app.models.market import MarketData
from app.indicators.candle_patterns import CandlePatternDetector


class StrategyService:
def analyze(self, market: MarketData, indicators: IndicatorResult):

        score = 0
        reasons = []
        detector = CandlePatternDetector()

patterns = detector.detect(market.candles)

        trend = "SIDEWAYS"
        action = "WAIT"

        # EMA Trend
        if indicators.ema20 > indicators.ema50 > indicators.ema200:
            trend = "BULLISH"
            score += 40
            reasons.append("EMA bullish alignment")

        elif indicators.ema20 < indicators.ema50 < indicators.ema200:
            trend = "BEARISH"
            score += 40
            reasons.append("EMA bearish alignment")

        # RSI
        if indicators.rsi < 30:
            score += 20
            reasons.append("RSI Oversold")

        elif indicators.rsi > 70:
            score += 20
            reasons.append("RSI Overbought")

        # MACD
        if indicators.macd > indicators.signal_line:
            score += 20
            reasons.append("MACD Bullish Cross")

        elif indicators.macd < indicators.signal_line:
            score += 20
            reasons.append("MACD Bearish Cross")

            # Candlestick Patterns
for pattern in patterns:

    if pattern.bullish:
        score += pattern.strength
        reasons.append(pattern.name)

    elif pattern.bearish:
       score += pattern.strength
        reasons.append(pattern.name)

        # Final Decision
        if trend == "BULLISH" and score >= 70:
            action = "CALL"

        elif trend == "BEARISH" and score >= 70:
            action = "PUT"

        else:
            action = "WAIT"

        return Signal(
           asset=market.asset,
            action=action,
            confidence=float(score),
            trend=trend,
            reasons=reasons
        )