import { Tick } from "./market/tick.js";
import { MarketManager } from "./market/market_manager.js";
import { sendMarket } from "./api/market_api.js";
import { CandleHistory } from "./market/history.js";
import OverlayManager from "./overlay/OverlayManager";

import "./overlay/window.css";

console.log("✅ Content script loaded");

const manager = new MarketManager();
const history = new CandleHistory(300);

const STORAGE_KEY = "pocketCandleHistory";

// ========================================
// RESTORE CANDLE HISTORY
// ========================================

async function restoreHistory() {

    try {

        const result =
            await chrome.storage.local.get(STORAGE_KEY);

        const saved =
            result[STORAGE_KEY] || {};

        let restored = 0;

        for (const asset of Object.keys(saved)) {

            const candles = saved[asset];

            if (!Array.isArray(candles)) {
                continue;
            }

            for (const candle of candles) {

                history.add({
                    asset: candle.asset || asset,
                    timeframe: String(candle.timeframe || "10"),
                    timestamp: String(candle.timestamp),
                    open: Number(candle.open),
                    high: Number(candle.high),
                    low: Number(candle.low),
                    close: Number(candle.close),
                    volume: Number(candle.volume || 0),
                });

                restored++;
            }
        }

        console.log("======================================");
        console.log("📚 CANDLE HISTORY RESTORED");
        console.log("Restored Candles:", restored);
        console.log("======================================");

    }

    catch (error) {

        console.error(
            "❌ Failed to restore candle history:",
            error
        );
    }
}


// ========================================
// SAVE CANDLE HISTORY
// ========================================

async function saveHistory(asset) {

    try {

        const candles =
            history.get(asset);

        const result =
            await chrome.storage.local.get(STORAGE_KEY);

        const saved =
            result[STORAGE_KEY] || {};

        saved[asset] =
            candles.slice(-300).map((candle) => ({
                asset: candle.asset,
                timeframe: String(candle.timeframe || "10"),
                timestamp: String(candle.timestamp),
                open: candle.open,
                high: candle.high,
                low: candle.low,
                close: candle.close,
                volume: candle.volume || 0,
            }));

        await chrome.storage.local.set({
            [STORAGE_KEY]: saved,
        });

        console.log(
            "💾 Candle history saved:",
            asset,
            saved[asset].length
        );

    }

    catch (error) {

        console.error(
            "❌ Failed to save candle history:",
            error
        );
    }
}


// ========================================
// WAIT UNTIL HISTORY IS RESTORED
// ========================================

const historyReady =
    restoreHistory();


// ========================================
// LISTEN FOR INJECTED TICKS
// ========================================

window.addEventListener(
    "message",
    async (event) => {

        if (event.source !== window) {
            return;
        }

        if (
            !event.data ||
            event.data.type !== "POCKET_OPTION_TICK"
        ) {
            return;
        }

        // ----------------------------------------
        // Make sure previous history is restored
        // before processing new candles.
        // ----------------------------------------

        await historyReady;

        const tick =
            new Tick(
                event.data.data.asset,
                event.data.data.timestamp,
                event.data.data.price
            );

        const candle =
            manager.update(tick);

        if (!candle) {
            return;
        }

        // ----------------------------------------
        // Add new candle
        // ----------------------------------------

        history.add(candle);

        const candles =
            history.get(candle.asset);

        // ----------------------------------------
        // Save BEFORE sending to background
        // ----------------------------------------

        await saveHistory(
            candle.asset
        );

        // ----------------------------------------
        // Debug
        // ----------------------------------------

        console.log(
            "======================================"
        );

        console.log(
            "📊 LOCAL HISTORY"
        );

        console.log(
            "Asset:",
            candle.asset
        );

        console.log(
            "History Size:",
            candles.length
        );

        if (candles.length > 0) {

            console.log(
                "First Timestamp:",
                candles[0].timestamp
            );

            console.log(
                "Last Timestamp:",
                candles[candles.length - 1].timestamp
            );

            console.log(
                "Unique Timestamps:",
                new Set(
                    candles.map(
                        c => String(c.timestamp)
                    )
                ).size
            );
        }

        console.log(
            "======================================"
        );

        // ----------------------------------------
        // Send complete history to Railway
        // ----------------------------------------

        try {

            const response =
                await sendMarket(
                    candle.asset,
                    candle.timeframe,
                    candles
                );

            console.log(
                "📡 Market history sent:",
                response
            );

        }

        catch (error) {

            console.error(
                "❌ Failed to send market history:",
                error
            );
        }
    }
);


// ========================================
// START OVERLAY MANAGER
// ========================================

OverlayManager.start();