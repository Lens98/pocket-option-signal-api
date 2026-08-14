from datetime import datetime, timedelta, timezone
import threading
import time

from app.models.trade_learning import TradeLearning
from app.storage.learning_storage import LearningStorage
from app.services.win_loss_tracker import WinLossTracker
from app.database.pattern_metadata_repository import PatternMetadataRepository
from app.services.pattern_learning import PatternLearning
from app.storage.shared import (
    market_storage,
    trade_storage,
)


class TradeMonitor:

    def __init__(self):

        self.market_storage = market_storage
        self.trade_storage = trade_storage
        self.tracker = WinLossTracker()
        self.learning = LearningStorage()
        self.pattern_metadata = PatternMetadataRepository()
        self.pattern_learning = PatternLearning()
        self.running = False
        self.thread = None

    # ----------------------------------------
    # Start Monitor
    # ----------------------------------------

    def start(self):

        if self.running:
            return

        self.running = True

        self.thread = threading.Thread(target=self.run, daemon=True)

        self.thread.start()

        print("----------------------------------------")
        print("✅ Trade Monitor Started")
        print("----------------------------------------")

    # ----------------------------------------
    # Stop Monitor
    # ----------------------------------------

    def stop(self):

        self.running = False

        print("----------------------------------------")
        print("🛑 Trade Monitor Stopped")
        print("----------------------------------------")

    # ----------------------------------------
    # Main Loop
    # ----------------------------------------

    def run(self):

        while self.running:

            try:

                self.check_open_trades()

            except Exception as e:

                print("----------------------------------------")
                print("Trade Monitor Error")
                print(e)
                print("----------------------------------------")

            time.sleep(1)

    # ----------------------------------------
    # Check Open Trades
    # ----------------------------------------

    def check_open_trades(self):

        trades = self.trade_storage.open_trades()

        print("----------------------------------------")
        print("🔎 TRADE MONITOR CHECK")
        print("Open trades:", len(trades))
        print("----------------------------------------")

        for trade in trades:

            print(
                "Trade:",
                trade.id,
                "| Status:",
                trade.status,
                "| Entry:",
                trade.entry_time,
                "| Expiration:",
                trade.expiration_seconds,
            )

        if not trades:
            return

        # Always use timezone-aware UTC
        now = datetime.now(timezone.utc)

        for trade in trades:

            # ----------------------------------------
            # Normalize Entry Time to UTC
            # ----------------------------------------

            entry_time = trade.entry_time

            if entry_time.tzinfo is None:

                # SQLite may return a naive datetime.
                # Treat stored timestamps as UTC.
                entry_time = entry_time.replace(tzinfo=timezone.utc)

            else:

                entry_time = entry_time.astimezone(timezone.utc)

            # ----------------------------------------
            # Calculate Expiration
            # ----------------------------------------

            expire_time = entry_time + timedelta(seconds=trade.expiration_seconds)

            print("----------------------------------------")
            print("Trade Timing")
            print("Trade ID :", trade.id)
            print("Entry    :", entry_time)
            print("Expires  :", expire_time)
            print("Now      :", now)
            print("----------------------------------------")

            # Trade has not expired yet
            if now < expire_time:
                continue

            # ----------------------------------------
            # Get Market
            # ----------------------------------------

            market = self.market_storage.get(trade.asset)

            if market is None:

                print("----------------------------------------")
                print("⚠️ CLOSE BLOCKED: MARKET NOT FOUND")
                print("Trade ID:", trade.id)
                print("Asset:", trade.asset)
                print("----------------------------------------")

                continue

            # ----------------------------------------
            # Make Sure Candles Exist
            # ----------------------------------------

            if len(market.candles) == 0:

                print("----------------------------------------")
                print("⚠️ CLOSE BLOCKED: NO CANDLES")
                print("Trade ID:", trade.id)
                print("Asset:", trade.asset)
                print("----------------------------------------")

                continue

            # ----------------------------------------
            # Exit Price
            # ----------------------------------------

            latest = market.candles[-1]

            exit_price = latest.close

            print("----------------------------------------")
            print("Closing Trade:", trade.id)
            print("Entry :", trade.entry_price)
            print("Exit  :", exit_price)
            print("----------------------------------------")

            # ----------------------------------------
            # Close Trade
            # ----------------------------------------

            closed_trade = self.tracker.close_trade(trade, exit_price)

            if not closed_trade:

                print("----------------------------------------")
                print("❌ CLOSE_TRADE FAILED")
                print("Trade ID:", trade.id)
                print("Asset:", trade.asset)
                print("Entry:", trade.entry_price)
                print("Exit:", exit_price)
                print("----------------------------------------")

                continue

            # ----------------------------------------
            # Save Learning Record
            # ----------------------------------------

            learning = TradeLearning(
                trade_id=closed_trade.id,
                asset=closed_trade.asset,
                timeframe=closed_trade.timeframe,
                session="UNKNOWN",
                action=closed_trade.action,
                indicator_mode="UNKNOWN",
                regime="UNKNOWN",
                trend=closed_trade.trend,
                confidence=closed_trade.confidence,
                probability=0.0,
                risk=closed_trade.risk,
                grade=closed_trade.grade,
                ema20=None,
                ema50=None,
                ema200=None,
                rsi=None,
                macd=None,
                signal_line=None,
                histogram=None,
                adx=None,
                atr=None,
                ema_used=any("EMA" in reason for reason in closed_trade.reasons),
                rsi_used=any("RSI" in reason for reason in closed_trade.reasons),
                macd_used=any("MACD" in reason for reason in closed_trade.reasons),
                adx_used=any("ADX" in reason for reason in closed_trade.reasons),
                atr_used=any("ATR" in reason for reason in closed_trade.reasons),
                entry_price=closed_trade.entry_price,
                exit_price=closed_trade.exit_price,
                payout=closed_trade.payout,
                profit=closed_trade.profit,
                result=closed_trade.result,
                entry_time=closed_trade.entry_time,
                exit_time=closed_trade.exit_time,
                duration=(
                    closed_trade.exit_time - closed_trade.entry_time
                ).total_seconds(),
                reasons=closed_trade.reasons,
            )

            # ----------------------------------------
            # Indicator Flags
            # ----------------------------------------

            print("========================================")
            print("INDICATOR FLAGS")
            print("EMA :", learning.ema_used)
            print("RSI :", learning.rsi_used)
            print("MACD:", learning.macd_used)
            print("ADX :", learning.adx_used)
            print("ATR :", learning.atr_used)
            print("Reasons:", learning.reasons)
            print("========================================")

            self.learning.add(learning)

            # ----------------------------------------
            # Learn Pattern
            # ----------------------------------------

            self.pattern_learning.learn(closed_trade.pattern, closed_trade.result)

            # ----------------------------------------
            # Save Metadata
            # ----------------------------------------

            self.pattern_metadata.save(closed_trade)

            print("----------------------------------------")
            print("📊 Pattern Metadata Saved")
            print("----------------------------------------")

            # ----------------------------------------
            # Pattern Learning Log
            # ----------------------------------------

            print("========================================")
            print("🧠 PATTERN LEARNING")
            print("========================================")
            print("Pattern :", closed_trade.pattern)
            print("Result  :", closed_trade.result)
            print("Trade   :", closed_trade.id)
            print("========================================")

            # ----------------------------------------
            # Learning Record Log
            # ----------------------------------------

            print("----------------------------------------")
            print("🧠 Learning Record Saved")
            print("----------------------------------------")
            print("Trade :", closed_trade.id)
            print("Result:", closed_trade.result)
            print("----------------------------------------")
