from app.models.pattern_result import PatternResult


class PatternFactory:

    @staticmethod
    def bullish(name, strength):

        return PatternResult(
            found=True,
            name=name,
            bullish=True,
            bearish=False,
            strength=strength
        )

    @staticmethod
    def bearish(name, strength):

        return PatternResult(
            found=True,
            name=name,
            bullish=False,
            bearish=True,
            strength=strength
        )

    @staticmethod
    def none():

        return PatternResult(
            found=False,
            name="None",
            bullish=False,
            bearish=False,
            strength=0
        )