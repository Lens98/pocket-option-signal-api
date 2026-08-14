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
// Parse Candle Timestamp
// ========================================

function getCandleTime(candle) {

    if (!candle || candle.timestamp == null) {
        return null;
    }

    const value = candle.timestamp;

    // Unix timestamp
    if (
        typeof value === "number" ||
        !isNaN(Number(value))
    ) {

        let timestamp = Number(value);

        // Milliseconds
        if (timestamp > 10000000000) {
            timestamp = timestamp / 1000;
        }

        return timestamp * 1000;
    }

    // ISO timestamp
    const parsed = Date.parse(String(value));

    if (!isNaN(parsed)) {
        return parsed;
    }

    return null;
}

// ========================================
// Get Time Remaining
// ========================================

function getRemainingSeconds(candle) {

    const candleStart =
        getCandleTime(candle);

    if (candleStart === null) {
        return null;
    }

    const timeframe =
        Number(window.marketTimeframe);

    if (!Number.isFinite(timeframe) || timeframe <= 0) {
        return null;
    }

    const now =
        Date.now();

    const elapsed =
        Math.floor(
            (now - candleStart) / 1000
        );

    const remaining =
        timeframe -
        (elapsed % timeframe);

    return Math.max(
        0,
        remaining
    );
}
// ========================================
// Format Countdown
// ========================================

function formatTime(seconds) {

    if (seconds === null) {
        return "--:--";
    }

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}

// ========================================
// Start Dashboard State Display
// ========================================

export function startCountdown(
    getMarketState,
    getLatestCandle
) {

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

        const latestCandle =
            getLatestCandle();

        const remaining =
            getRemainingSeconds(
                latestCandle
            );

        const countdownText =
            formatTime(remaining);

        const signal =
            window.latestSignal || {};

        const bias =
            String(
                signal.bias ||
                signal.action ||
                "WAIT"
            ).toUpperCase();

        const confidence =
            Number(
                signal.confidence || 0
            );

        // ========================================
        // WAITING
        // ========================================

        if (marketState === "WAITING") {

            timer.innerHTML =
                countdownText;

            banner.innerHTML =
                "🟡 WAITING FOR SETUP";

            action.innerHTML =
                "WAIT";

            entryMessage.innerHTML =
                "Waiting for a valid trade setup.";

            return;
        }

        // ========================================
        // ANALYZING CURRENT CANDLE
        // ========================================

        if (marketState === "ANALYZING") {

            timer.innerHTML =
                countdownText;

            banner.innerHTML =
                "🔍 ANALYZING CURRENT CANDLE";

            if (
                (bias === "CALL" || bias === "PUT") &&
                confidence > 0
            ) {

                action.innerHTML =
                    bias;

                entryMessage.innerHTML =
                    `${bias} detected • Confidence ${Math.round(confidence)}% • Enter on the next candle.`;

            } else {

                action.innerHTML =
                    "WAIT";

                entryMessage.innerHTML =
                    "AI is analyzing the current candle.";
            }

            return;
        }

        // ========================================
        // CONFIRMING
        // ========================================

        if (marketState === "CONFIRMING") {

            timer.innerHTML =
                countdownText;

            banner.innerHTML =
                "🟡 CONFIRMING CURRENT CANDLE";

            if (
                bias === "CALL" ||
                bias === "PUT"
            ) {

                action.innerHTML =
                    bias;

            } else {

                action.innerHTML =
                    "WAIT";
            }

            entryMessage.innerHTML =
                "AI is confirming the direction for the next candle.";

            return;
        }

        // ========================================
        // READY
        // ========================================

        if (marketState === "READY") {

            timer.innerHTML =
                countdownText;

            banner.innerHTML =
                "🟢 NEXT CANDLE SETUP READY";

            if (
                bias === "CALL" ||
                bias === "PUT"
            ) {

                action.innerHTML =
                    bias;

                entryMessage.innerHTML =
                    `${bias} • Enter when the new candle opens.`;

            } else {

                action.innerHTML =
                    "READY";

                entryMessage.innerHTML =
                    "Setup detected. Waiting for the new candle.";
            }

            return;
        }

        // ========================================
        // WAITING FOR CANDLE CLOSE
        // ========================================

        if (
            marketState ===
            "WAITING_FOR_CANDLE_CLOSE"
        ) {

            timer.innerHTML =
                countdownText;

            banner.innerHTML =
                "⏳ ENTER ON NEXT CANDLE";

            if (
                bias === "CALL" ||
                bias === "PUT"
            ) {

                action.innerHTML =
                    bias;

                entryMessage.innerHTML =
                    `${bias} • Enter in ${countdownText} when the new candle opens.`;

            } else {

                action.innerHTML =
                    "WAIT";

                entryMessage.innerHTML =
                    "AI is analyzing the current candle.";
            }

            return;
        }

        // ========================================
        // ENTRY
        // ========================================

        if (marketState === "ENTRY") {

            timer.innerHTML =
                "NOW";

            banner.innerHTML =
                "🚀 ENTER NOW";

            action.innerHTML =
                signal.action ||
                signal.bias ||
                "ENTER";

            entryMessage.innerHTML =
                "Final signal confirmed. Enter immediately on the new candle.";

            return;
        }

        // ========================================
        // ACTIVE
        // ========================================

        if (marketState === "ACTIVE") {

            timer.innerHTML =
                "--:--";

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

            timer.innerHTML =
                "--:--";

            banner.innerHTML =
                "🏁 TRADE COMPLETE";

            action.innerHTML =
                "RESULT";

            entryMessage.innerHTML =
                "Trade completed. Waiting for the next setup.";

            return;
        }

        // ========================================
        // UNKNOWN
        // ========================================

        timer.innerHTML =
            countdownText;

        banner.innerHTML =
            "⚪ WAITING";

        action.innerHTML =
            "WAIT";

        entryMessage.innerHTML =
            "Waiting for the next valid setup.";
    }

    update();

    countdownInterval =
        setInterval(
            update,
            250
        );
}