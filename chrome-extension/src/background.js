// ========================================
// Pocket Option AI PRO
// Background Engine
// ========================================

const API_URL =
    "https://pocket-option-signal-api-production.up.railway.app";

const state = {

    connected: false,

    tradeState: "WAITING",

    signal: null,

    lastSignalKey: "",

    history: [],

    stats: {
        CALL: 0,
        PUT: 0,
        WAIT: 0
    },

    lastUpdate: null
};

// ========================================
// Restore Saved Session
// ========================================

async function restoreState() {

    const result =
        await chrome.storage.local.get("pocketState");

    if (result.pocketState) {

        Object.assign(
            state,
            result.pocketState
        );

        console.log("✅ Session restored.");

    }
}

// ========================================
// Save Session
// ========================================

async function saveState() {

    await chrome.storage.local.set({
        pocketState: state
    });
}

// ========================================
// Create Unique Signal Key
// ========================================

function getSignalKey(signal) {

    if (!signal) {
        return "";
    }

    return [
        signal.asset || "",
        signal.timestamp || "",
        signal.entry_price || "",
        signal.action || ""
    ].join("|");
}

// ========================================
// API Polling
// ========================================

async function refresh() {

    try {

        // ----------------------------------------
        // Get Signal
        // ----------------------------------------

        const signalResponse =
            await fetch(`${API_URL}/signal`);

        if (!signalResponse.ok) {
            throw new Error(
                `/signal returned ${signalResponse.status}`
            );
        }

        const signal =
            await signalResponse.json();

        state.signal = signal;

        // ----------------------------------------
        // Get Trade State
        // ----------------------------------------

        const tradeResponse =
            await fetch(`${API_URL}/trade/state`);

        if (!tradeResponse.ok) {
            throw new Error(
                `/trade/state returned ${tradeResponse.status}`
            );
        }

        const trade =
            await tradeResponse.json();

        state.tradeState =
            trade.state || "WAITING";

        // ----------------------------------------
        // Get Trade History
        // ----------------------------------------

        const historyResponse =
            await fetch(`${API_URL}/trade/all`);

        if (!historyResponse.ok) {
            throw new Error(
                `/trade/all returned ${historyResponse.status}`
            );
        }

        state.history =
            await historyResponse.json();

        // ----------------------------------------
        // Connection Status
        // ----------------------------------------

        state.connected = true;

        state.lastUpdate =
            new Date().toISOString();

        // ----------------------------------------
        // Count Signal ONLY ONCE
        // ----------------------------------------

        const signalKey =
            getSignalKey(signal);

        if (
            signalKey &&
            signalKey !== state.lastSignalKey
        ) {

            if (
                signal &&
                !signal.status &&
                state.stats[signal.action] !== undefined
            ) {

                state.stats[signal.action]++;

            }

            state.lastSignalKey =
                signalKey;
        }

        await saveState();

    }

    catch (err) {

        state.connected = false;

        state.lastUpdate =
            new Date().toISOString();

        await saveState();

        console.error(
            "❌ Background refresh failed:",
            err.message
        );

    }
}

// ========================================
// Startup
// ========================================

async function initialize() {

    await restoreState();

    await refresh();

    setInterval(
        refresh,
        1000
    );
}

initialize();

// ========================================
// Popup Communication
// ========================================

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        if (message.type === "GET_STATE") {

            sendResponse(state);

        }

        return true;
    }
);