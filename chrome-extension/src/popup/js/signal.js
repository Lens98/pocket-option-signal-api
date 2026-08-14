/* ==========================================
   UPDATE SIGNAL CARD
========================================== */

export function updateSignal(signal) {

    updateAction(signal);
    updateConfidence(signal);
    updateInfo(signal);
    updateStatus(signal);

}


/* ==========================================
   ACTION
========================================== */

function updateAction(signal) {

    const action = document.getElementById("action");

    if (!action) return;

    const rawAction = String(signal.action || "WAIT").toUpperCase();
    const bias = String(signal.bias || "").toUpperCase();
    const marketState = String(signal.market_state || "").toUpperCase();
    const tradeStatus = String(signal.trade_status || "").toUpperCase();

    /*
       IMPORTANT:
       When a trade is already active, the backend may
       intentionally return:

           bias   = CALL
           action = WAIT
           state  = ACTIVE

       WAIT means "do not enter another trade".
       It does NOT mean the existing trade direction is WAIT.
    */

    let displayAction = rawAction;

    const activeTrade =
        marketState === "ACTIVE" ||
        tradeStatus === "ACTIVE";

    if (
        activeTrade &&
        rawAction === "WAIT" &&
        (bias === "CALL" || bias === "PUT")
    ) {
        displayAction = bias;
    }

    action.textContent = displayAction;

    action.className = "signal-action";

    switch (displayAction) {

        case "CALL":
            action.classList.add("call");
            break;

        case "PUT":
            action.classList.add("put");
            break;

        case "WAIT":
        default:
            action.classList.add("wait");
            break;
    }

}


/* ==========================================
   CONFIDENCE
========================================== */

function updateConfidence(signal) {

    const confidence = document.getElementById("confidence");

    if (!confidence) return;

    const value = Number(signal.confidence);

    if (Number.isFinite(value)) {
        confidence.textContent = `${Math.round(value)}%`;
    } else {
        confidence.textContent = "--";
    }

}


/* ==========================================
   SIGNAL INFO
========================================== */

function updateInfo(signal) {

    const trend = document.getElementById("trend");
    const risk = document.getElementById("risk");
    const expiration = document.getElementById("expiration");

    if (trend) {
        trend.textContent = signal.trend ?? "--";
    }

    if (risk) {
        risk.textContent = signal.risk ?? "--";
    }

    if (expiration) {
        expiration.textContent = signal.expiration ?? "--";
    }

}


/* ==========================================
   STATUS
========================================== */

function updateStatus(signal) {

    const status = document.getElementById("signalStatus");

    if (!status) return;

    const marketState = String(
        signal.market_state || ""
    ).toUpperCase();

    const tradeStatus = String(
        signal.trade_status || ""
    ).toUpperCase();

    const bias = String(
        signal.bias || ""
    ).toUpperCase();

    /*
       ACTIVE TRADE
    */

    if (
        (marketState === "ACTIVE" || tradeStatus === "ACTIVE") &&
        (bias === "CALL" || bias === "PUT")
    ) {

        status.textContent =
            `ACTIVE TRADE — ${bias}`;

        status.className = "active";

        return;
    }


    /*
       Backend reason
    */

    if (
        signal.reason &&
        String(signal.reason).trim() !== ""
    ) {

        status.textContent = signal.reason;

        return;
    }


    /*
       Normal state
    */

    status.textContent =
        signal.market_state || "Waiting...";

}


/* ==========================================
   CONNECTION STATUS
========================================== */

export function updateConnectionStatus(online) {

    const header = document.getElementById("status");

    const footer = document.getElementById("statusText");

    const updated = document.getElementById("updated");

    const engine = document.getElementById("engineStatus");

    if (!header || !footer) return;


    if (online) {

        // Header
        header.textContent = "🟢 Online";
        header.className = "status online";


        // Footer
        footer.textContent = "🟢 Connected";
        footer.className = "online";


        // Last updated time
        if (updated) {
            updated.textContent =
                new Date().toLocaleTimeString();
        }


        if (engine) {
            engine.textContent = "Running";
        }


    } else {

        // Header
        header.textContent = "🔴 Offline";
        header.className = "status offline";


        // Footer
        footer.textContent = "🔴 Disconnected";
        footer.className = "offline";


        if (engine) {
            engine.textContent = "Offline";
        }
    }

}