// ========================================
// Pocket Option AI PRO
// Background Engine
// ========================================

const API_URL =
    "https://pocket-option-signal-api-production.up.railway.app";

async function getAuthHeaders() {
    const result =
        await chrome.storage.local.get("pocketOptionAuthToken");

    return {
        "Authorization":
            `Bearer ${result.pocketOptionAuthToken || ""}`
    };
}


// ========================================
// STATE
// ========================================

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

        console.log(
            "✅ Session restored."
        );
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

        // ----------------------------------------
        // Get Signal
        // ----------------------------------------

        const signalResponse =
            await fetch(
                `${API_URL}/signal`,
                {
                    headers:
                        await getAuthHeaders()
                }
            );

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
            await fetch(
                `${API_URL}/trade/state`,
                {
                    headers:
                        await getAuthHeaders()
                }
            );

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
            await fetch(
                `${API_URL}/trade/all`,
                {
                    headers:
                        await getAuthHeaders()
                }
            );

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

            const signalAction =
                String(
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

    } catch (err) {

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
// Popup / Content Script Communication
// ========================================

chrome.runtime.onMessage.addListener(
    (message, sender, sendResponse) => {

        // ========================================
        // GET STATE
        // ========================================

        if (
            message.type === "GET_STATE"
        ) {

            sendResponse(state);

            return true;
        }


        // ========================================
        // SEND MARKET DATA TO RAILWAY
        // ========================================

        if (
            message.type === "SEND_MARKET"
        ) {

            console.log(
                "📡 Sending market data to Railway..."
            );


            // ----------------------------------------
            // Save latest live market data
            // ----------------------------------------

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

                saveState();
            }


            console.log(
                "Asset:",
                message.payload?.asset
            );

            console.log(
                "Candles:",
                message.payload?.candles?.length
            );


            // ----------------------------------------
            // Get authentication headers
            // ----------------------------------------

            getAuthHeaders()
                .then((authHeaders) => {

                    return fetch(
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

                })

                .then(
                    async (response) => {

                        console.log(
                            "📡 MARKET UPDATE STATUS:",
                            response.status
                        );


                        const text =
                            await response.text();

                        let result;


                        try {

                            result =
                                JSON.parse(text);

                        } catch {

                            result = {
                                raw: text
                            };
                        }


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
                )

                .catch(
                    (error) => {

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
                );


            // IMPORTANT:
            // Keep the message channel open
            // for the asynchronous fetch above.

            return true;
        }


        // ========================================
        // UNKNOWN MESSAGE
        // ========================================

        return true;
    }
);