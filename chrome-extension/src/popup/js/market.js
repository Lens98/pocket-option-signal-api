/* ==========================================
   MARKET INFORMATION
========================================== */

export function updateMarket(signal) {

    // ======================================
    // Dashboard
    // ======================================

    set("asset", signal.asset);

    set("trend", signal.trend);

    set("risk", signal.risk);

    set("expiration", signal.expiration);

    set(
        "probability",
        `${Number(signal.probability ?? 0).toFixed(1)}%`
    );

    set("grade", signal.grade);

    set("session", signal.session);

    set("regime", signal.regime);

    // ======================================
    // Live Market Card
    // ======================================

    set("chartAsset", signal.asset);

    set(
        "chartPrice",
        Number(signal.entry_price ?? 0).toFixed(5)
    );

    const chartChange =
        document.getElementById("chartChange");

    if (chartChange) {

        chartChange.textContent =
            `${signal.trend} • ${signal.session}`;

        chartChange.className = "market-change";

        if (signal.trend === "BULLISH") {

            chartChange.classList.add("bullish");

        }

        else if (signal.trend === "BEARISH") {

            chartChange.classList.add("bearish");

        }

        else {

            chartChange.classList.add("neutral");

        }

    }

}
/* ==========================================
   HELPER
========================================== */

function set(id, value) {

    const element = document.getElementById(id);

    if (!element) return;

    element.textContent = value ?? "---";

    element.classList.remove(
        "BULLISH",
        "BEARISH",
        "SIDEWAYS",
        "LOW",
        "MEDIUM",
        "HIGH"
    );

    const colorValues = [
        "BULLISH",
        "BEARISH",
        "SIDEWAYS",
        "LOW",
        "MEDIUM",
        "HIGH"
    ];

    const upper = String(value ?? "").toUpperCase();

    if (colorValues.includes(upper)) {

        element.classList.add(upper);

    }

}