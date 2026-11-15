/* ==========================================
   AI ANALYSIS
========================================== */

export function updateAnalysis(signal) {

    set("emaStatus", signal.trend === "BULLISH"
        ? "✓ Bullish"
        : "✓ Bearish");

    set("emaStrength", signal.grade ?? "--");

    set("rsiStatus",
        signal.rsi_status ?? "--");

    set("rsiStrength",
        signal.rsi_strength ?? "--");

    set("macdStatus",
        signal.macd_status ?? "--");

    set("macdStrength",
        signal.macd_strength ?? "--");

    set("volumeStatus",
        signal.volume_status ?? "--");

    set("volumeStrength",
        signal.volume_strength ?? "--");

    set("structureStatus",
        signal.structure_status ?? "--");

    set("structureStrength",
        signal.structure_strength ?? "--");

    set("volatilityStatus",
        signal.volatility_status ?? "--");

    set("volatilityStrength",
        signal.volatility_strength ?? "--");

    set("supportStatus",
        signal.support_status ?? "--");

    set("supportStrength",
        signal.support_strength ?? "--");

    set("liquidityStatus",
        signal.liquidity_status ?? "--");

    set("liquidityStrength",
        signal.liquidity_strength ?? "--");

}

function set(id, value) {

    const element =
        document.getElementById(id);

    if (!element) return;

    element.textContent = value;

}