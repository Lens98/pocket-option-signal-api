class TradingFilters:

    def check(self, signal):

        if signal.action == "WAIT":

            return False

        return True