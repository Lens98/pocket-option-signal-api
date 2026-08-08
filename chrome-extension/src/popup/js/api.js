const API_BASE = "http://127.0.0.1:8000";

/* ==========================================
   GET SIGNAL
========================================== */

export async function getSignal() {

    const response =
       await fetch(`${API_BASE}/signal`);

    if (!response.ok) {

        throw new Error("Unable to load signal");

    }

    return await response.json();

}

/* ==========================================
   GET STATISTICS
========================================== */

export async function getTradeStatistics() {

    const response =
        await fetch(`${API_BASE}/trade/statistics`);

    if (!response.ok) {

        throw new Error("Unable to load statistics");

    }

    return await response.json();

}

/* ==========================================
   GET HISTORY
========================================== */

export async function getTradeHistory() {

    const response =
        await fetch(`${API_BASE}/trade/all`);

    if (!response.ok) {

        throw new Error("Unable to load history");

    }

    return await response.json();

}

/* ==========================================
   GET TRADE STATE
========================================== */

export async function getTradeState() {

    const response =
        await fetch(`${API_BASE}/trade/state`);

    if (!response.ok) {

        throw new Error("Unable to load trade state");

    }

    return await response.json();

}

/* ==========================================
   GET LIVE CANDLES
========================================== */

export async function getCandles(asset) {

    const encodedAsset = encodeURIComponent(asset);

    console.log("Loading candles for:", asset);

    const response =
        await fetch(`${API_BASE}/candles/${encodedAsset}`);

    console.log("Status:", response.status);

    if (!response.ok) {

        throw new Error("Unable to load candles");

    }

    const candles = await response.json();

    console.log("Candles returned:", candles.length);

    return candles;

}