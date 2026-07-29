import { getSignal } from "./api.js";
import { updateGauge } from "./gauge.js";
import { loadTradeStatistics } from "./statistics.js";
import { loadTradeHistory } from "./history.js";
import { initChart } from "./chart.js";
import { startCountdown } from "./countdown.js";
import { getCandles } from "./api.js";
import { setCandles } from "./chart.js";
import { updateMarket } from "./market.js";
import {
    updateSignal,
    updateConnectionStatus
} from "./signal.js";

/* ==========================================
   DASHBOARD INITIALIZATION
========================================== */

export async function initializeDashboard() {

    try {

        initChart();

        await refreshDashboard();

        startCountdown(() => window.marketState);

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

    // Only check API connection
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

        window.marketState = signal.action ?? "WAITING";

        updateSignal(signal);

        updateMarket(signal);

        const candles = await getCandles(signal.asset);

        setCandles(candles);

        updateGauge(signal.confidence || 0);

        await loadTradeStatistics();

        await loadTradeHistory();

    } catch (error) {

        console.error("Dashboard Error:", error);

        // DON'T change the online status here

    }

}