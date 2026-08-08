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

    const value = (signal.action || "WAIT").toUpperCase();

    action.textContent = value;

    action.className = "signal-action";

    switch (value) {

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

    confidence.textContent = `${Math.round(signal.confidence ?? 0)}%`;

}

/* ==========================================
   SIGNAL INFO
========================================== */

function updateInfo(signal) {

    const trend = document.getElementById("trend");
    const risk = document.getElementById("risk");
    const expiration = document.getElementById("expiration");

    if (trend)
        trend.textContent = signal.trend ?? "--";

    if (risk)
        risk.textContent = signal.risk ?? "--";

    if (expiration)
        expiration.textContent = signal.expiration ?? "--";

}

/* ==========================================
   STATUS
========================================== */

function updateStatus(signal) {

    const status = document.getElementById("signalStatus");

    if (!status) return;

    if (signal.reason && signal.reason.trim() !== "") {

        status.textContent = signal.reason;

    } else {

        status.textContent = signal.market_state || "Waiting...";

    }

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
        header.innerHTML = "🟢 Online";
        header.className = "status online";

        // Footer
        footer.textContent = "🟢 Connected";
        footer.className = "online";

        // Last updated time
        if (updated) {
            updated.textContent = new Date().toLocaleTimeString();
        }
        if (engine) {

           engine.textContent = "Running";

           }

    } else {

        // Header
        header.innerHTML = "🔴 Offline";
        header.className = "status offline";

        // Footer
        footer.textContent = "🔴 Disconnected";
        footer.className = "offline";
    }
}