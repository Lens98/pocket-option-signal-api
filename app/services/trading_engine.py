from app.services.indicator_service import IndicatorService
from app.services.strategy_service import StrategyService
from app.support_resistance.support_resistance import SupportResistance
from app.risk.risk_manager import RiskManager

class TradingEngine:

    def __init__(self):

        self.indicators = IndicatorService()
        self.strategy = StrategyService()
        self.support = SupportResistance()
        self.risk = RiskManager()

    def generate_signal(self, market):

        indicator_result = self.indicators.calculate(market)

        levels = self.support.analyze(market.candles)

        signal = self.strategy.analyze(
            market=market,
            indicators=indicator_result
        )

        risk = self.risk.evaluate(signal)

        if not risk["allowed"]:
            signal.action = "WAIT"
            signal.reasons.extend(risk["reasons"])

        return signal