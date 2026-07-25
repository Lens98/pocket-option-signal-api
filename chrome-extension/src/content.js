import { Tick } from "./market/tick.js";
import { MarketManager } from "./market/market_manager.js";
import { sendMarket } from "./api/market_api.js";
import { CandleHistory } from "./market/history.js";
import { HistoryManager } from "./market/history_manager.js";
console.log("✅ Content script loaded");

const manager = new MarketManager();
const history = new CandleHistory(300);

// Inject the page script
const script = document.createElement("script");
script.src = chrome.runtime.getURL("src/injected.js");
script.onload = () => script.remove();

(document.head || document.documentElement).appendChild(script);

// Listen for messages from injected.js
window.addEventListener("message", async (event) => {

    console.log("Content received message:", event.data);

    if (event.source !== window) return;

    if (event.data.type !== "POCKET_OPTION_TICK") return;

    const tick = new Tick(
        event.data.data.asset,
        event.data.data.timestamp,
        event.data.data.price
    );

    console.log("Tick:", tick);

    const candle = manager.update(tick);

   if (candle) {

    history.add(candle);

    const candles = history.get(candle.asset);

    console.log("=====================================");
    console.log("History Size:", candles.length);
    console.log("=====================================");

    await sendMarket(
        candle.asset,
        candle.timeframe,
        candles
    );

}
});