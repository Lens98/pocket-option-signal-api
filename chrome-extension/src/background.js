// ========================================
// Pocket Option AI PRO
// Background Engine
// ========================================
const API_URL =
    "https://pocket-option-signal-api-production.up.railway.app";

async function getAuthHeaders() {

    const result =
        await chrome.storage.local.get(
            "pocketOptionAuthToken"
        );

    const token =
        result.pocketOptionAuthToken;

    if (!token) {

        return null;

    }

    return {

        "Authorization": `Bearer ${token}`

    };

}

const state = {

    connected: false,

    tradeState: "WAITING",

    signal: null,

    lastSignalKey: "",

    history: [],
    marketAsset: null,

    marketCandles: [],

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
        signal.next_candle_bias ||
        signal.action ||
        "WAIT"
    ].join("|");
}

// ========================================
// API Polling
// ========================================

async function refresh() {

    try {

        // Get ONE authenticated header set
        // for the entire refresh cycle.

        const authHeaders =
            await getAuthHeaders();
        if (!authHeaders) {

    state.connected = false;
    state.tradeState = "WAITING";

    state.lastUpdate =
        new Date().toISOString();

    await saveState();

    console.log(
        "⏭️ Background refresh skipped: user not logged in"
    );

    return;

}

        console.log(
            "🔐 Background auth token found:",
            !!authHeaders.Authorization
        );
        // ----------------------------------------
        // Get Signal
        // ----------------------------------------

        const signalResponse =
            await fetch(`${API_URL}/signal`, {
                headers: authHeaders
            });

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
            await fetch(`${API_URL}/trade/state`, {
                headers: authHeaders
            });

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
            await fetch(`${API_URL}/trade/all`, {
                headers: authHeaders
            });

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

            const signalAction = String(
                signal?.next_candle_bias ||
                signal?.action ||
                "WAIT"
            ).toUpperCase();

            if (
                signal &&
                !signal.status &&
                state.stats[signalAction] !== undefined
            ) {

                state.stats[signalAction]++;
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
        3000
    );
}

initialize();

// ========================================
// Popup / Content Script Communication
// ========================================

chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {

        // ========================================
        // GET STATE
        // ========================================

        if (message.type === "GET_STATE") {

            sendResponse(state);

            return true;
        }

        // ========================================
        // SEND MARKET DATA TO RAILWAY
        // ========================================
                if (message.type === "SEND_MARKET") {

            console.log(
                "📡 Sending market data to Railway..."
            );

            try {

                if (message.payload) {

                    if (message.payload.asset) {

                        state.marketAsset =
                            message.payload.asset;

                    }

                    if (
                        Array.isArray(
                            message.payload.candles
                        )
                    ) {

                        state.marketCandles =
                            message.payload.candles;

                    }

                    await saveState();

                }

                console.log(
                    "Asset:",
                    message.payload?.asset
                );

                console.log(
                    "Candles:",
                    message.payload?.candles?.length
                );

                const authHeaders =
    await getAuthHeaders();

if (!authHeaders) {

    console.log(
        "⏭️ Market update skipped: user not logged in"
    );

    sendResponse({
        ok: false,
        error: "User not logged in"
    });

    return true;
}

const response =
    await fetch(
        `${API_URL}/market/update`,
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json",

                ...authHeaders
            },

            body: JSON.stringify(
                message.payload
            )
        }
    );

                const text =
                    await response.text();

                let result;

                try {

                    result =
                        JSON.parse(text);

                }

                catch {

                    result = {
                        raw: text
                    };

                }

                console.log(
                    "📡 MARKET UPDATE STATUS:",
                    response.status
                );

                console.log(
                    "📡 MARKET UPDATE RESPONSE:",
                    result
                );

                sendResponse({

                    ok: response.ok,

                    status:
                        response.status,

                    result

                });

            }

            catch (error) {

                console.error(
                    "❌ MARKET UPDATE FAILED:",
                    error
                );

                sendResponse({

                    ok: false,

                    error:
                        error.message

                });

            }

            return true;

        }
                 // ========================================
        // CAPTURE MARKET SCREENSHOT
        // ========================================

        if (message.type === "CAPTURE_MARKET_SCREENSHOT") {

            try {

                const tabs = await chrome.tabs.query({
                    active: true,
                    currentWindow: true
                });

                const tab = tabs[0];

                if (!tab || !tab.id) {

                    throw new Error(
                        "No active tab found"
                    );

                }

                const screenshot =
                    await chrome.tabs.captureVisibleTab(
                        tab.windowId,
                        {
                            format: "jpeg",
                            quality: 70
                        }
                    );
                console.log(
                    "📸 MARKET SCREENSHOT CAPTURED"
                );

                sendResponse({
                    ok: true,
                    screenshot
                });

            }

            catch (error) {

                console.error(
                    "❌ SCREENSHOT CAPTURE FAILED:",
                    error
                );

                sendResponse({
                    ok: false,
                    error: error.message
                });

            }

            return true;

        }
        return true;

    }

);