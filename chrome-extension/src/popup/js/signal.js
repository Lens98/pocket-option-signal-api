export function updateSignal(signal) {

    updateAction(signal);

    updateBanner(signal);

    updateAnalysis(signal);

}

function updateAction(signal) {

    const action =
        document.getElementById("action");

    action.innerHTML =
        signal.action;

    action.className =
        `action ${signal.action.toLowerCase()}`;

}

function updateBanner(signal) {

    const banner = document.getElementById("buyBanner");

    if (!banner) return;

    if (signal.action === "CALL") {

        banner.innerHTML = "🟢 BUY CALL";
        banner.className = "buy-banner call";

    }

    else if (signal.action === "PUT") {

        banner.innerHTML = "🔴 BUY PUT";
        banner.className = "buy-banner put";

    }

    else {

        banner.innerHTML = "🟡 WAIT";
        banner.className = "buy-banner wait";

    }

}
function updateAnalysis(signal) {

    const analysis = document.getElementById("analysis");

    if (!analysis) return;

    if (!signal.reasons || signal.reasons.length === 0) {

        analysis.innerHTML = `
            <div class="reason waiting">
                ⏳ Waiting for enough market data...
            </div>
        `;

        return;

    }

    analysis.innerHTML = signal.reasons.map(reason => `

        <div class="reason">

            <span class="good">✔</span>

            <div>${reason}</div>

        </div>

    `).join("");

}
/* ==========================================
   CONNECTION STATUS
========================================== */

export function updateConnectionStatus(online) {

    const status = document.getElementById("status");

    if (!status) return;

    if (online) {

        status.innerHTML = "🟢 Online";

        status.className = "status online";

    }

    else {

        status.innerHTML = "🔴 Offline";

        status.className = "status offline";

    }

}