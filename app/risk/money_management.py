class MoneyManagement:

    def position_size(self, balance):

        risk_percent = 0.02

        return round(balance * risk_percent, 2)