from abc import ABC, abstractmethod


class MarketProvider(ABC):

    @abstractmethod
    def get_candles(
        self,
        asset: str,
        timeframe: str,
        limit: int
    ):
        """
        Return a list of Candle objects.
        """
        pass