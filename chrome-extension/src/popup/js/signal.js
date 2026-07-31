export function updateSignal(signal) {

    updateAction(signal);

    updateBanner(signal);

    updateInstruction(signal);

    updateConfirmations(signal);

    updateAnalysis(signal);

}

function updateAction(signal) {

    const action = document.getElementById("action");

    if (!action) return;

    // Only show ENTER NOW when the backend says ENTRY
    if (
        signal.market_state === "ENTRY" &&
        signal.can_enter
    ) {

        action.innerHTML = "🚀 ENTER NOW";
        action.className = "action entry";

        return;

    }

    // Otherwise show the current instruction
    const actionText = signal.action || signal.bias || "WAIT";

action.innerHTML = actionText;

action.className =
    `action ${actionText.toLowerCase().replace(/\s+/g, "-")}`;

}
function updateConfirmations(signal) {

    const confirmations = [

        ["emaStatus", signal.ema_confirmed, "EMA"],

        ["macdStatus", signal.macd_confirmed, "MACD"],

        ["rsiStatus", signal.rsi_confirmed, "RSI"],

        ["structureStatus", signal.structure_confirmed, "Structure"],

        ["zoneStatus", signal.zone_confirmed, "Zone"],

        ["adxStatus", signal.adx_confirmed, "ADX"],

        ["atrStatus", signal.atr_confirmed, "ATR"],

        ["candleStatus", signal.candle_confirmed, "Candle"],

        ["pullbackStatus", signal.pullback_confirmed, "Pullback"]

    ];

    confirmations.forEach(([id, value, label]) => {

        const element = document.getElementById(id);

        if (!element) return;

        if (value) {

            element.innerHTML = `✅ ${label}`;

            element.className = "confirmation success";

        }

        else {

            element.innerHTML = `❌ ${label}`;

            element.className = "confirmation fail";

        }

    });

}

function updateInstruction(signal) {

    const instruction =
        document.getElementById("instruction");

    const reason =
        document.getElementById("reason");

    if (!instruction || !reason) return;

    instruction.innerHTML =
        signal.instruction || "Waiting for signal...";

    reason.innerHTML =
        signal.reason || "--";

}

function updateBanner(signal) {

    const banner = document.getElementById("buyBanner");

    if (!banner) return;

    // Highest priority
    if (
        signal.market_state === "ENTRY" &&
        signal.can_enter
    ) {

        banner.innerHTML = `🚀 ENTER NOW (${signal.bias})`;
        banner.className = "buy-banner entry";

        return;

    }

    if (signal.bias === "CALL") {

        banner.innerHTML = "🟢 BUY CALL";
        banner.className = "buy-banner call";

    }

    else if (signal.bias === "PUT") {

        banner.innerHTML = "🔴 BUY PUT";
        banner.className = "buy-banner put";

    }

    else {

        banner.innerHTML = `🟡 ${signal.market_state}`;
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