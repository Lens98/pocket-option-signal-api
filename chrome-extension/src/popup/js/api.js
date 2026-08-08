const API = "https://pocket-option-signal-api-production.up.railway.app";

/* ==========================================
   GET SIGNAL
========================================== */

export async function getSignal() {

    const response =
       await fetch(`${API}/signal`);

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
        await fetch(`${API}/trade/statistics`);

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
        await fetch(`${API}/trade/all`);

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
        await fetch(`${API}/trade/state`);

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
        await fetch(`${API}/candles/${encodedAsset}`);

    console.log("Status:", response.status);

    if (!response.ok) {

        throw new Error("Unable to load candles");

    }

    const candles = await response.json();

    console.log("Candles returned:", candles.length);

    return candles;

}