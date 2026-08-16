const API =
    "https://pocket-option-signal-api-production.up.railway.app";

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
                    "Cache-Control": "no-cache"
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
            `${API}/trade/statistics`
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
            `${API}/trade/all`
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
            `${API}/trade/state`
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