const API =
    "https://pocket-option-signal-api-production.up.railway.app";

async function getAuthHeaders() {
    const result = await chrome.storage.local.get(
        "pocketOptionAuthToken"
    );

    return {
        "Authorization": `Bearer ${
            result.pocketOptionAuthToken || ""
        }`
    };
}


/* ==========================================
   GET SIGNAL
========================================== */

export async function getSignal() {

    console.log(
        "🌐 UI → RAILWAY /signal:",
        new Date().toISOString()
    );

    const url =
        `${API}/signal?ts=${Date.now()}`;

    console.log(
        "🌐 REQUEST:",
        url
    );

    const response =
        await fetch(
            url,
            {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache",
                    ...(await getAuthHeaders())
                }
            }
        );

    console.log(
        "🌐 RAILWAY RESPONSE:",
        response.status
    );

    if (!response.ok) {

        throw new Error(
            `/signal returned ${response.status}`
        );

    }

    const data =
        await response.json();

    console.log(
        "🌐 SIGNAL RECEIVED:",
        data.action,
        data.confidence,
        data.timestamp
    );

    return data;
}


/* ==========================================
   GET STATISTICS
========================================== */

export async function getTradeStatistics() {

    const response =
        await fetch(
            `${API}/trade/statistics`,
            {
                headers: await getAuthHeaders()
            }
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load statistics"
        );

    }

    return await response.json();
}


/* ==========================================
   GET HISTORY
========================================== */

export async function getTradeHistory() {

    const response =
        await fetch(
            `${API}/trade/all`,
            {
                headers: await getAuthHeaders()
            }
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load history"
        );

    }

    return await response.json();
}


/* ==========================================
   GET TRADE STATE
========================================== */

export async function getTradeState() {
    const response =
        await fetch(
            `${API}/trade/state`,
            {
                headers: await getAuthHeaders()
            }
        );

    if (!response.ok) {

        throw new Error(
            "Unable to load trade state"
        );

    }

    return await response.json();
}


/* ==========================================
   GET LIVE CANDLES
========================================== */

export async function getCandles(asset) {

    const encodedAsset =
        encodeURIComponent(asset);

    console.log(
        "🌐 Loading candles for:",
        asset
    );

    const response =
        await fetch(
            `${API}/candles/${encodedAsset}?ts=${Date.now()}`,
            {
                method: "GET",
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache"
                }
            }
        );

    console.log(
        "🌐 CANDLE RESPONSE:",
        response.status
    );

    if (!response.ok) {

        throw new Error(
            `/candles/${asset} returned ${response.status}`
        );

    }

    const candles =
        await response.json();

    console.log(
        "🌐 CANDLES RECEIVED:",
        candles.length
    );

    return candles;
}
/* ==========================================
   GET TODAY'S STATISTICS
========================================== */

export async function getTodayStatistics() {

    const response =
        await fetch(
            `${API}/trade/today`,
            {
                headers:
                    await getAuthHeaders()
            }
        );

    if (!response.ok) {

        throw new Error(
            `Unable to load today's statistics: ${response.status}`
        );

    }

    return await response.json();

}
/* ==========================================
   ANALYZE MARKET
========================================== */

export async function analyzeMarket() {

    console.log("🧠 REQUESTING MARKET ANALYSIS");

    /* ==========================================
       CAPTURE POCKET OPTION SCREENSHOT
    ========================================== */

    console.log("📸 REQUESTING MARKET SCREENSHOT");

    const screenshotResult =
        await chrome.runtime.sendMessage({
            type: "CAPTURE_MARKET_SCREENSHOT"
        });

    if (!screenshotResult?.ok) {

        console.error(
            "❌ SCREENSHOT CAPTURE FAILED:",
            screenshotResult?.error
        );

        throw new Error(
            screenshotResult?.error ||
            "Unable to capture market screenshot"
        );

    }

    console.log("📸 SCREENSHOT RECEIVED");

    /* ==========================================
       SHOW SCREENSHOT INSIDE POPUP
    ========================================== */

    const previewImage = document.getElementById(
        "marketScreenshotPreview"
    );

    const previewContainer = document.getElementById(
        "screenshotPreviewContainer"
    );

    if (previewImage && previewContainer) {

        previewImage.src =
            screenshotResult.screenshot;

        previewContainer.style.display =
            "block";

        console.log(
            "📸 SCREENSHOT PREVIEW DISPLAYED"
        );

    }

    /* ==========================================
       SEND ANALYSIS REQUEST
    ========================================== */

    const response = await fetch(
        `${API}/analyze-market`,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                ...(await getAuthHeaders())
            },

            body: JSON.stringify({
                screenshot: screenshotResult.screenshot
            })
        }
    );

    console.log(
        "🧠 ANALYSIS RESPONSE:",
        response.status
    );

    if (!response.ok) {

        throw new Error(
            `/analyze-market returned ${response.status}`
        );

    }

    const data = await response.json();

    console.log(
        "🧠 AI MARKET RESULT:",
        data
    );

    /* ==========================================
    HIDE SCREENSHOT PREVIEW AFTER ANALYSIS
    ========================================== */

    if (previewImage && previewContainer) {

        previewContainer.style.display =
            "none";

        previewImage.src = "";

    }

    return data;
}