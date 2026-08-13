import { Tick } from "./market/tick.js";
import { MarketManager } from "./market/market_manager.js";
import { sendMarket } from "./api/market_api.js";
import { CandleHistory } from "./market/history.js";
import OverlayManager from "./overlay/OverlayManager";


import "./overlay/window.css";
console.log("✅ Content script loaded");

const manager = new MarketManager();
const history = new CandleHistory(300);

// --------------------------------------
// Listen for injected messages
// --------------------------------------

window.addEventListener("message", async (event) => {

    if (event.source !== window) return;

    if (event.data.type !== "POCKET_OPTION_TICK") return;

    const tick = new Tick(
        event.data.data.asset,
        event.data.data.timestamp,
        event.data.data.price
    );

    const candle = manager.update(tick);

    if (!candle) return;

    history.add(candle);

    const candles = history.get(candle.asset);

    console.log("======================================");
    console.log("📊 LOCAL HISTORY");
    console.log("Asset:", candle.asset);
    console.log("History Size:", candles.length);

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
               candles.map(c => String(c.timestamp))
            ).size
        );

    }

    console.log("======================================");

    await sendMarket(
        candle.asset,
        candle.timeframe,
        candles
    );

});

// ========================================
// Start Overlay Manager
// ========================================

OverlayManager.start();