// ========================================
// Pocket Option AI PRO
// Background Engine v2
// ========================================

const API_URL = "http://127.0.0.1:8000";

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
// API Polling
// ========================================

async function refresh() {

    try {

        console.log("Fetching /signal...");

const signalResponse =
    await fetch(`${API_URL}/signal`);

console.log("✅ /signal OK");

state.signal =
    await signalResponse.json();

console.log("Fetching /trade/state...");

const tradeResponse =
    await fetch(`${API_URL}/trade/state`);

console.log("✅ /trade/state OK");

const trade =
    await tradeResponse.json();

        state.tradeState =
            trade.state;

        state.connected = true;
        console.log("✅ Connected to API");
console.log(state);

        state.lastUpdate =
            new Date().toISOString();

        if (
            state.signal &&
            !state.signal.status
        ) {
          const signalKey =
`${state.signal.asset}-${state.signal.action}-${state.tradeState}-${state.lastUpdate}`;
            if (
    signalKey ===
    state.lastSignalKey
) {

    await saveState();

    return;

            }
            state.lastSignalKey =
    signalKey;

            state.history.unshift({

                asset:
                    state.signal.asset,

                action:
                    state.signal.action,

                confidence:
                    state.signal.confidence,

                time:
    new Date().toISOString()

            });

            if (
                state.history.length > 100
            ) {

                state.history.pop();

            }

            if (
                state.stats[
                    state.signal.action
                ] !== undefined
            ) {

                state.stats[
                    state.signal.action
                ]++;

            }

        }

        await saveState();

    }

    
catch (err) {

    state.connected = false;

    await saveState();

    console.error("❌ Background refresh failed");

    console.error(err);

}

}

// ========================================
// Startup
// ========================================

async function initialize() {

    await restoreState();

    await refresh();

    setInterval(refresh,1000);

}

initialize();
// ========================================
// Popup Communication
// ========================================

chrome.runtime.onMessage.addListener(

(message,sender,sendResponse)=>{

    if(message.type==="GET_STATE"){

        sendResponse(state);

    }

    return true;

});