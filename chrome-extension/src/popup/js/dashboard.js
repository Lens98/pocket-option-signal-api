import { getSignal } from "./api.js";
import { updateGauge } from "./gauge.js";
import { loadTradeStatistics } from "./statistics.js";
import { loadTradeHistory } from "./history.js";
import { initChart, setCandles } from "./chart.js";
import { startCountdown } from "./countdown.js";
import { getCandles } from "./api.js";
import { updateInstruction } from "./instruction.js";
import { updateAnalysis } from "./analysis.js";
import { updateMarket } from "./market.js";
import {
    updateSignal,
    updateConnectionStatus
} from "./signal.js";


/* ==========================================
   GET EXTENSION MARKET STATE
========================================== */

async function getExtensionState() {

    return new Promise((resolve) => {

        chrome.runtime.sendMessage(
            {
                type: "GET_STATE"
            },
            (state) => {

                if (chrome.runtime.lastError) {

                    console.error(
                        "Extension state error:",
                        chrome.runtime.lastError.message
                    );

                    resolve({});

                    return;
                }

                resolve(state || {});

            }
        );

    });

}


export async function initializeDashboard() {

    console.log("🚀 DASHBOARD INITIALIZING");

    try {

        initChart();

        console.log("✅ Chart initialized");

    }

    catch (error) {

        console.error(
            "❌ Chart initialization failed:",
            error
        );

    }

    try {

        await refreshDashboard();

        console.log(
            "✅ First dashboard refresh complete"
        );

    }

    catch (error) {

        console.error(
            "❌ First dashboard refresh failed:",
            error
        );

    }

    try {

        startCountdown(
            () => window.marketState,
            () => window.latestCandle
        );

        console.log(
            "✅ Countdown started"
        );

    }

    catch (error) {

        console.error(
            "❌ Countdown failed:",
            error
        );

    }

    // ========================================
    // CONTINUOUS DASHBOARD REFRESH
    // ========================================

    if (window.dashboardRefreshTimer) {

        clearInterval(
            window.dashboardRefreshTimer
        );

    }

    window.dashboardRefreshTimer =
        setInterval(
            async () => {

                console.log(
                    "🔄 DASHBOARD REFRESH:",
                    new Date().toISOString()
                );

                try {

                    await refreshDashboard();

                }

                catch (error) {

                    console.error(
                        "❌ Dashboard refresh failed:",
                        error
                    );

                }

            },
            1000
        );

    console.log(
        "🟢 DASHBOARD AUTO-REFRESH STARTED"
    );

}

/* ==========================================
   REFRESH EVERYTHING
========================================== */

async function refreshDashboard() {
    console.log(
    "🔄 DASHBOARD REFRESH:",
    new Date().toISOString()
);

    let signal;

    let extensionState;


    /* ======================================
       GET AI SIGNAL
    ====================================== */

    try {

        signal = await getSignal();
        console.log(
    "📡 NEW SIGNAL FROM RAILWAY:",
    signal
);

    // ======================================
    // SHARE AI SIGNAL WITH COUNTDOWN
    // ======================================

    window.latestSignal = signal;

    window.marketTimeframe =
        Number(signal?.timeframe) || 60;

    updateConnectionStatus(true);

}

    catch (error) {

        updateConnectionStatus(false);

        console.error(
            "API Connection Error:",
            error
        );

        signal = {
            status: "No signal yet"
        };

    }


    /* ======================================
       GET LIVE MARKET STATE
    ====================================== */

    try {

        extensionState =
            await getExtensionState();

    }

    catch (error) {

        console.error(
            "Unable to get extension market state:",
            error
        );

        extensionState = {};

    }


    /* ======================================
       MARKET DATA
    ====================================== */

    const marketAsset =
        signal?.asset ||
        extensionState.marketAsset ||
        null;

    let candles =
        Array.isArray(extensionState.marketCandles)
            ? extensionState.marketCandles
            : [];


    console.log(
        "======================================"
    );

    console.log(
        "LIVE MARKET STATE"
    );

    console.log(
        "Asset:",
        marketAsset
    );

    console.log(
        "Candles:",
        candles.length
    );

    console.log(
        "======================================"
    );


    /* ======================================
       SIGNAL STATE
    ====================================== */

    window.marketState =
        signal?.market_state ||
        "WAITING";


    /* ======================================
       UPDATE AI UI
    ====================================== */

    try {

        updateSignal(signal);

        updateInstruction(signal);

        updateAnalysis(signal);

    }

    catch (error) {

        console.error(
            "AI UI update error:",
            error
        );

    }


    /* ======================================
       UPDATE MARKET UI
    ====================================== */

    try {

        updateMarket(
            signal,
            {
                asset: marketAsset,
                candles
            }
        );

    }

    catch (error) {

        console.error(
            "Market UI update error:",
            error
        );

    }


    /* ======================================
       LOAD CANDLES
    ====================================== */

    try {

        /*
         * Live candles should already be coming
         * from the extension.
         */

        if (candles.length === 0 && marketAsset) {

            console.log(
                "No local candles yet. Requesting backend candles for:",
                marketAsset
            );

            try {

                candles =
                    await getCandles(
                        marketAsset
                    );

            }

            catch (error) {

                console.warn(
                    "Backend candle request failed:",
                    error
                );

            }

        }


        if (candles.length > 0) {

            window.latestCandle =
                candles[candles.length - 1];

            console.log(
                "Latest candle:",
                window.latestCandle
            );

            console.log(
                "Total candles:",
                candles.length
            );

            setCandles(candles);

        }

        else {

            window.latestCandle =
                null;

            console.warn(
                "No candles available yet."
            );

        }

    }

    catch (error) {

        console.error(
            "Candle UI error:",
            error
        );

    }


    /* ======================================
       CONFIDENCE
    ====================================== */

    try {

        updateGauge(
            Number(
                signal?.confidence ?? 0
            )
        );

    }

    catch (error) {

        console.error(
            "Confidence UI error:",
            error
        );

    }


    /* ======================================
       TRADE DATA
    ====================================== */

    if (!window.tradeRefreshTimer) {

        window.tradeRefreshTimer =
            Date.now();

    }


    if (
        Date.now() -
        window.tradeRefreshTimer >
        5000
    ) {

        try {

            await loadTradeStatistics();

            await loadTradeHistory();

        }

        catch (error) {

            console.error(
                "Trade data refresh error:",
                error
            );

        }

        window.tradeRefreshTimer =
            Date.now();

    }

}