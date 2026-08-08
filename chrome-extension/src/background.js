// ========================================
// Pocket Option AI PRO
// Background Engine v2
// ========================================

const API_URL = "https://pocket-option-signal-api-production.up.railway.app";

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
        // ========================================
       // Load Trade History
      // ========================================

       const historyResponse =
           await fetch(`${API_URL}/trade/all`);

state.history =
    await historyResponse.json();

        state.connected = true;
        console.log("✅ Connected to API");
        console.log(state);

        state.lastUpdate =
            new Date().toISOString();

        if (
            state.signal &&
            !state.signal.status
        ) {
           
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
        console.error("Error message:", err.message);
        console.error("API URL:", API_URL);
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