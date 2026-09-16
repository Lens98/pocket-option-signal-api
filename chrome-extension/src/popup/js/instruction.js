/* ==========================================
   AI INSTRUCTION
========================================== */

export function updateInstruction(signal) {

    const instruction =
        document.getElementById("instruction");

    const reason1 =
        document.getElementById("reason1");

    const reason2 =
        document.getElementById("reason2");

    const reason3 =
        document.getElementById("reason3");

    const status =
        document.getElementById("instructionStatus");

    if (instruction) {

        instruction.textContent =
            signal.action === "CALL"
                ? "🟢 BUY CALL AT NEXT CANDLE"
                : signal.action === "PUT"
                ? "🔴 BUY PUT AT NEXT CANDLE"
                : "🟡 WAIT FOR THE NEXT CANDLE";

    }

    if (reason1)
        reason1.textContent =
            signal.reasons?.[0] || "";

    if (reason2)
        reason2.textContent =
            signal.reasons?.[1] || "";

    if (reason3)
        reason3.textContent =
            signal.reasons?.[2] || "";

    if (status)
        status.textContent =
            signal.market_state || "Monitoring market...";

}