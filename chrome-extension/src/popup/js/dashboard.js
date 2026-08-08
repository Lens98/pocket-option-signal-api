import { getSignal } from "./api.js";
import { updateGauge } from "./gauge.js";
import { loadTradeStatistics } from "./statistics.js";
import { loadTradeHistory } from "./history.js";
import { initChart } from "./chart.js";
import { startCountdown } from "./countdown.js";
import { getCandles } from "./api.js";
import { setCandles } from "./chart.js";
import { updateInstruction } from "./instruction.js";
import { updateAnalysis } from "./analysis.js";
import { updateMarket } from "./market.js";
import {
    updateSignal,
    updateConnectionStatus
} from "./signal.js";

/* ==========================================
   DASHBOARD INITIALIZATION
========================================== */
export async function initializeDashboard() {

    console.log("Dashboard initialized");

    try {

        initChart();

        console.log("Chart initialized");

        await refreshDashboard();

        console.log("First refresh complete");

        startCountdown(() => window.marketState);

        console.log("Countdown started");

        setInterval(refreshDashboard, 1000);

    }

    catch (error) {

        console.error("Dashboard Error:", error);

    }

}

/* ==========================================
   REFRESH EVERYTHING
========================================== */

async function refreshDashboard() {

    let signal;

    try {

        signal = await getSignal();

        updateConnectionStatus(true);

    } catch (error) {

        updateConnectionStatus(false);

        console.error("API Connection Error:", error);

        return;

    }


    // Everything below is UI only
    try {

        window.marketState = signal.market_state ?? "WAITING";

        updateSignal(signal);
        updateInstruction(signal);
        updateAnalysis(signal);

updateMarket(signal);

console.log("Requesting candles for:", signal.asset);

if (!signal.asset) {

    console.warn("No asset available for candles");

    return;

}

const candles = await getCandles(signal.asset);

console.log("Candles from backend:", candles);
console.log("Number of candles:", candles.length);

if (candles.length > 0) {

    console.log("First candle:", candles[0]);

}

setCandles(candles);
        updateGauge(signal.confidence || 0);

   // Refresh trade data every 5 seconds
if (!window.tradeRefreshTimer) {

    window.tradeRefreshTimer = Date.now();

}


if (Date.now() - window.tradeRefreshTimer > 5000) {

    await loadTradeStatistics();

    await loadTradeHistory();

    window.tradeRefreshTimer = Date.now();

}

    } catch (error) {

        console.error("Dashboard Error:", error);

        // DON'T change the online status here

    }

}