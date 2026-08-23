from app.simulator.account import Account
from app.simulator.payout import Payout
from app.simulator.simulator import PocketOptionSimulator


class Signal:

    action = "CALL"


account = Account()

payout = Payout()

sim = PocketOptionSimulator()

print("Starting:", account.balance)

sim.execute(account, Signal(), True, payout)

print("After Win:", account.balance)

sim.execute(account, Signal(), False, payout)

print("After Loss:", account.balance)

print()

print("Wins:", account.wins)

print("Losses:", account.losses)

print("Trades:", account.total_trades)