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
const ACTIVE_ASSET_KEY = "pocketActiveAsset";

let activeAsset = null;


// ========================================
// RESTORE ACTIVE ASSET
// ========================================

async function restoreActiveAsset() {

    try {

        const result =
            await chrome.storage.local.get(
                ACTIVE_ASSET_KEY
            );

        const savedAsset =
            result[ACTIVE_ASSET_KEY];

        if (
            typeof savedAsset === "string" &&
            savedAsset.trim()
        ) {

            activeAsset =
                savedAsset.trim();

            console.log(
                "🎯 ACTIVE ASSET RESTORED:",
                activeAsset
            );
        }

    }

    catch (error) {

        console.error(
            "❌ Failed to restore active asset:",
            error
        );
    }
}


// ========================================
// SAVE ACTIVE ASSET
// ========================================

async function saveActiveAsset(asset) {

    try {

        await chrome.storage.local.set({
            [ACTIVE_ASSET_KEY]: asset
        });

        console.log(
            "💾 ACTIVE ASSET SAVED:",
            asset
        );

    }

    catch (error) {

        console.error(
            "❌ Failed to save active asset:",
            error
        );
    }
}


// ========================================
// RESTORE CANDLE HISTORY
// ========================================

async function restoreHistory() {

    try {

        const result =
            await chrome.storage.local.get(
                STORAGE_KEY
            );

        const saved =
            result[STORAGE_KEY] || {};

        let restored = 0;

        for (
            const asset of Object.keys(saved)
        ) {

            const candles =
                saved[asset];

            if (!Array.isArray(candles)) {
                continue;
            }

            for (
                const candle of candles
            ) {

                history.add({

                    asset:
                        candle.asset || asset,

                    timeframe:
                        String(
                            candle.timeframe || "10"
                        ),

                    timestamp:
                        String(
                            candle.timestamp
                        ),

                    open:
                        Number(candle.open),

                    high:
                        Number(candle.high),

                    low:
                        Number(candle.low),

                    close:
                        Number(candle.close),

                    volume:
                        Number(
                            candle.volume || 0
                        ),
                });

                restored++;
            }
        }

        console.log(
            "======================================"
        );

        console.log(
            "📚 CANDLE HISTORY RESTORED"
        );

        console.log(
            "Restored Candles:",
            restored
        );

        console.log(
            "======================================"
        );

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
            await chrome.storage.local.get(
                STORAGE_KEY
            );

        const saved =
            result[STORAGE_KEY] || {};

        saved[asset] =
            candles
                .slice(-300)
                .map((candle) => ({

                    asset:
                        candle.asset,

                    timeframe:
                        String(
                            candle.timeframe || "10"
                        ),

                    timestamp:
                        String(
                            candle.timestamp
                        ),

                    open:
                        candle.open,

                    high:
                        candle.high,

                    low:
                        candle.low,

                    close:
                        candle.close,

                    volume:
                        candle.volume || 0,

                }));

        await chrome.storage.local.set({

            [STORAGE_KEY]:
                saved,

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
// RESTORE DATA BEFORE PROCESSING TICKS
// ========================================

const historyReady =
    Promise.all([
        restoreHistory(),
        restoreActiveAsset()
    ]);


// ========================================
// LISTEN FOR INJECTED MESSAGES
// ========================================

window.addEventListener(
    "message",
    async (event) => {

        if (
            event.source !== window
        ) {

            return;
        }

        if (
            !event.data
        ) {

            return;
        }


        // ========================================
        // ACTIVE POCKET OPTION ASSET
        // ========================================

        if (
            event.data.type ===
            "POCKET_OPTION_ACTIVE_ASSET"
        ) {

            const asset =
                event.data?.data?.asset;

            if (
                typeof asset !== "string" ||
                !asset.trim()
            ) {

                console.warn(
                    "⚠️ Invalid active asset message"
                );

                return;
            }

            const normalized =
                asset.trim();


            // ----------------------------------------
            // Ignore duplicate asset messages
            // ----------------------------------------

            if (
                activeAsset === normalized
            ) {

                return;
            }


            // ----------------------------------------
            // Change active asset
            // ----------------------------------------

            activeAsset =
                normalized;

            console.log(
                "======================================"
            );

            console.log(
                "🎯 ACTIVE ASSET CHANGED"
            );

            console.log(
                "Selected Asset:",
                activeAsset
            );

            console.log(
                "======================================"
            );


            await saveActiveAsset(
                activeAsset
            );

            // ========================================
            // SYNC ACTIVE ASSET WITH RAILWAY
            // ========================================

            try {

                const authResult =
                    await chrome.storage.local.get(
                        "pocketOptionAuthToken"
                    );

                const token =
                    authResult.pocketOptionAuthToken;

                const response = await fetch(
                    `https://pocket-option-signal-api-production.up.railway.app/market/select/${encodeURIComponent(activeAsset)}`,
                    {
                        headers: {
                            "Authorization":
                                `Bearer ${token || ""}`
                        }
                    }
                );

                const result =
                    await response.json();

                console.log(
                    "📡 ACTIVE ASSET SYNCED TO RAILWAY:",
                    result
                );

            } catch (error) {

                console.error(
                    "❌ FAILED TO SYNC ACTIVE ASSET:",
                    error
                );
            }

            return;
        }


        // ========================================
        // POCKET OPTION TICK
        // ========================================

        if (
            event.data.type !==
            "POCKET_OPTION_TICK"
        ) {

            return;
        }


        // ----------------------------------------
        // Make sure history + asset are restored
        // ----------------------------------------

        await historyReady;


        // ----------------------------------------
        // Do not process ticks until we know
        // which asset is actually selected.
        // ----------------------------------------

        if (!activeAsset) {

            console.log(
                "⏳ Waiting for active Pocket Option asset..."
            );

            return;
        }


        const tickAsset =
            event.data?.data?.asset;


        // ----------------------------------------
        // Validate tick asset
        // ----------------------------------------

        if (
            typeof tickAsset !== "string" ||
            !tickAsset.trim()
        ) {

            return;
        }


        const normalizedTickAsset =
            tickAsset.trim();


        // ========================================
        // CRITICAL ASSET FILTER
        // ========================================

        if (
            normalizedTickAsset !==
            activeAsset
        ) {

            return;
        }


        console.log(
            "======================================"
        );

        console.log(
            "🎯 PROCESSING ACTIVE ASSET TICK"
        );

        console.log(
            "Selected Asset:",
            activeAsset
        );

        console.log(
            "Tick Asset:",
            normalizedTickAsset
        );

        console.log(
            "======================================"
        );


        const tick =
            new Tick(
                normalizedTickAsset,
                event.data.data.timestamp,
                event.data.data.price
            );


        const candle =
            manager.update(tick);


        if (!candle) {

            return;
        }


        // ----------------------------------------
        // Safety check
        // ----------------------------------------

        if (
            candle.asset !==
            activeAsset
        ) {

            console.warn(
                "⚠️ CANDLE ASSET MISMATCH"
            );

            console.warn(
                "Active:",
                activeAsset
            );

            console.warn(
                "Candle:",
                candle.asset
            );

            return;
        }


        // ----------------------------------------
        // Add new candle
        // ----------------------------------------

        history.add(
            candle
        );


        const candles =
            history.get(
                activeAsset
            );


        // ----------------------------------------
        // Save BEFORE sending to background
        // ----------------------------------------

        await saveHistory(
            activeAsset
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
            "ACTIVE ASSET:",
            activeAsset
        );

        console.log(
            "CANDLE ASSET:",
            candle.asset
        );

        console.log(
            "History Size:",
            candles.length
        );


        if (
            candles.length > 0
        ) {

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
                        c =>
                            String(
                                c.timestamp
                            )
                    )
                ).size
            );
        }


        console.log(
            "======================================"
        );


        // ========================================
        // SEND ONLY ACTIVE ASSET TO RAILWAY
        // ========================================

        try {

            const response =
                await sendMarket(
                    activeAsset,
                    candle.timeframe,
                    candles
                );


            console.log(
                "📡 ACTIVE ASSET MARKET HISTORY SENT:"
            );

            console.log(
                "Asset:",
                activeAsset
            );

            console.log(
                "Response:",
                response
            );

        }

        catch (error) {

            console.error(
                "❌ Failed to send active asset market history:",
                error
            );
        }
    }
);


// ========================================
// START OVERLAY MANAGER
// ========================================

OverlayManager.start();