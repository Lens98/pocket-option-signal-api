let countdownInterval = null;

// ========================================
// Stop Countdown
// ========================================

export function stopCountdown() {

    if (countdownInterval) {

        clearInterval(countdownInterval);

        countdownInterval = null;

    }
}

// ========================================
// Start Dashboard State Display
// ========================================

export function startCountdown(getMarketState) {

    stopCountdown();

    const timer =
        document.getElementById("countdown");

    const banner =
        document.getElementById("countdownLabel");

    const action =
        document.getElementById("action");

    const entryMessage =
        document.getElementById("entryMessage");

    function update() {

        const marketState =
            getMarketState();

        // ========================================
        // WAITING
        // ========================================

        if (marketState === "WAITING") {

            timer.innerHTML = "--:--";

            banner.innerHTML =
                "🟡 WAITING FOR SETUP";

            action.innerHTML =
                "WAIT";

            entryMessage.innerHTML =
                "Waiting for a valid trade setup.";

            return;
        }

        // ========================================
        // ANALYZING
        // ========================================

        if (marketState === "ANALYZING") {

            timer.innerHTML = "--:--";

            banner.innerHTML =
                "🔍 ANALYZING";

            action.innerHTML =
                "WAIT";

            entryMessage.innerHTML =
                "Analyzing the current market setup.";

            return;
        }

        // ========================================
        // CONFIRMING
        // ========================================

        if (marketState === "CONFIRMING") {

            timer.innerHTML = "--:--";

            banner.innerHTML =
                "🟡 CONFIRMING";

            action.innerHTML =
                "WAIT";

            entryMessage.innerHTML =
                "Waiting for stronger confirmation.";

            return;
        }

        // ========================================
        // READY
        // ========================================

        if (marketState === "READY") {

            timer.innerHTML = "--:--";

            banner.innerHTML =
                "🟢 PREPARING ENTRY";

            action.innerHTML =
                "READY";

            entryMessage.innerHTML =
                "Setup detected. Waiting for confirmation.";

            return;
        }

        // ========================================
        // WAITING FOR CANDLE CLOSE
        // ========================================

        if (
            marketState ===
            "WAITING_FOR_CANDLE_CLOSE"
        ) {

            timer.innerHTML = "--:--";

            banner.innerHTML =
                "⏳ WAITING FOR CANDLE CLOSE";

            action.innerHTML =
                "WAIT";

            entryMessage.innerHTML =
                "Analyzing the current candle. Final signal will be confirmed when it closes.";

            return;
        }

        // ========================================
        // ENTRY
        // ========================================

        if (marketState === "ENTRY") {

            timer.innerHTML = "NOW";

            banner.innerHTML =
                "🚀 ENTER NOW";

            action.innerHTML =
                "🚀 ENTER NOW";

            entryMessage.innerHTML =
                "Final signal confirmed. Enter immediately on the new candle.";

            return;
        }

        // ========================================
        // ACTIVE
        // ========================================

        if (marketState === "ACTIVE") {

            timer.innerHTML = "--:--";

            banner.innerHTML =
                "🟢 TRADE ACTIVE";

            action.innerHTML =
                "ACTIVE";

            entryMessage.innerHTML =
                "Trade is currently running.";

            return;
        }

        // ========================================
        // RESULT
        // ========================================

        if (marketState === "RESULT") {

            timer.innerHTML = "--:--";

            banner.innerHTML =
                "🏁 TRADE COMPLETE";

            action.innerHTML =
                "RESULT";

            entryMessage.innerHTML =
                "Trade completed. Waiting for the next setup.";

            return;
        }

        // ========================================
        // UNKNOWN STATE
        // ========================================

        timer.innerHTML = "--:--";

        banner.innerHTML =
            "⚪ WAITING";

        action.innerHTML =
            "WAIT";

        entryMessage.innerHTML =
            "Waiting for the next valid setup.";
    }

    update();

    countdownInterval =
        setInterval(update, 1000);
}