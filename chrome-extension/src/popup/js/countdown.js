let countdownInterval = null;


// ========================================
// BINARY TIMEFRAME
// ========================================
//
// Your market feed may be 10-second candles,
// but the binary trade expiration is 60 seconds.
//
// The countdown therefore follows the actual
// 1-minute candle clock.
//
const BINARY_TIMEFRAME_SECONDS = 60;


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

    // ========================================
    // Unix timestamp
    // ========================================

    if (
        typeof value === "number" ||
        !isNaN(Number(value))
    ) {

        let timestamp = Number(value);

        // Unix milliseconds
        if (timestamp > 10000000000) {
            timestamp = timestamp / 1000;
        }

        return timestamp * 1000;
    }

    // ========================================
    // ISO timestamp
    // ========================================

    const parsed =
        Date.parse(String(value));

    if (!isNaN(parsed)) {
        return parsed;
    }

    return null;
}


// ========================================
// Get Binary Candle Remaining Time
// ========================================
//
// IMPORTANT:
//
// We do NOT count from the moment the API
// responded.
//
// We use the real 1-minute clock:
//
// 08:17:00 -> 08:18:00
// 08:18:00 -> 08:19:00
//
// ========================================

function getRemainingSeconds() {

    const now = Date.now();

    const timeframeMs =
        BINARY_TIMEFRAME_SECONDS * 1000;

    const nextCandle =
        Math.ceil(
            now / timeframeMs
        ) * timeframeMs;

    let remaining =
        Math.ceil(
            (nextCandle - now) / 1000
        );

    /*
     * At the exact candle boundary,
     * show the new 60-second candle rather
     * than showing 00.
     */

    if (remaining <= 0) {
        remaining = BINARY_TIMEFRAME_SECONDS;
    }

    return Math.min(
        BINARY_TIMEFRAME_SECONDS,
        remaining
    );
}


// ========================================
// Format Countdown
// ========================================

function formatTime(seconds) {

    if (
        seconds === null ||
        seconds === undefined ||
        !Number.isFinite(seconds)
    ) {

        return "--:--";
    }

    const safeSeconds =
        Math.max(
            0,
            Math.floor(seconds)
        );

    const minutes =
        Math.floor(
            safeSeconds / 60
        );

    const remainingSeconds =
        safeSeconds % 60;

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

    if (!timer || !banner || !action || !entryMessage) {
        return;
    }


    function update() {

        const marketState =
            String(
                getMarketState() || "WAITING"
            ).toUpperCase();

        const latestCandle =
            getLatestCandle();

        /*
         * Keep this call so the countdown remains
         * synchronized with the live candle source.
         *
         * We intentionally do not calculate the
         * countdown from the API response time.
         */

        const candleTime =
            getCandleTime(latestCandle);

        const hasCandle =
            candleTime !== null;

        const remaining =
            hasCandle
                ? getRemainingSeconds()
                : null;

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

            timer.textContent =
                countdownText;

            banner.textContent =
                "🟡 WAITING FOR SETUP";

            action.textContent =
                "WAIT";

            entryMessage.textContent =
                "Waiting for a valid trade setup.";

            return;
        }


        // ========================================
        // ANALYZING
        // ========================================

        if (marketState === "ANALYZING") {

            timer.textContent =
                countdownText;

            banner.textContent =
                "🔍 ANALYZING CURRENT CANDLE";

            if (
                (bias === "CALL" || bias === "PUT") &&
                confidence > 0
            ) {

                action.textContent =
                    bias;

                entryMessage.textContent =
                    `${bias} detected • Confidence ${Math.round(
                        confidence
                    )}% • Enter on the next candle.`;

            } else {

                action.textContent =
                    "WAIT";

                entryMessage.textContent =
                    "AI is analyzing the current candle.";
            }

            return;
        }


        // ========================================
        // CONFIRMING
        // ========================================

        if (marketState === "CONFIRMING") {

            timer.textContent =
                countdownText;

            banner.textContent =
                "🟡 CONFIRMING CURRENT CANDLE";

            if (
                bias === "CALL" ||
                bias === "PUT"
            ) {

                action.textContent =
                    bias;

            } else {

                action.textContent =
                    "WAIT";
            }

            entryMessage.textContent =
                `AI is confirming the direction for the next candle. ${
                    hasCandle
                        ? `Next candle in ${countdownText}.`
                        : ""
                }`;

            return;
        }


        // ========================================
        // READY
        // ========================================

        if (marketState === "READY") {

            timer.textContent =
                countdownText;

            banner.textContent =
                "🟢 NEXT CANDLE SETUP READY";

            if (
                bias === "CALL" ||
                bias === "PUT"
            ) {

                action.textContent =
                    bias;

                entryMessage.textContent =
                    `${bias} • Next candle in ${countdownText}.`;

            } else {

                action.textContent =
                    "READY";

                entryMessage.textContent =
                    `Setup detected. Next candle in ${countdownText}.`;
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

            timer.textContent =
                countdownText;

            banner.textContent =
                "⏳ NEXT CANDLE ENTRY";

            if (
                bias === "CALL" ||
                bias === "PUT"
            ) {

                action.textContent =
                    bias;

                entryMessage.textContent =
                    `${bias} • Enter when the new candle opens in ${countdownText}.`;

            } else {

                action.textContent =
                    "WAIT";

                entryMessage.textContent =
                    `AI is analyzing the current candle. ${
                        hasCandle
                            ? `Next candle in ${countdownText}.`
                            : ""
                    }`;
            }

            return;
        }


        // ========================================
        // ENTRY
        // ========================================

        if (marketState === "ENTRY") {

            timer.textContent =
                "NOW";

            banner.textContent =
                "🚀 ENTER NOW";

            action.textContent =
                (
                    signal.action ||
                    signal.bias ||
                    "ENTER"
                );

            entryMessage.textContent =
                "Final signal confirmed. Enter immediately on the new candle.";

            return;
        }


        // ========================================
        // ACTIVE
        // ========================================

        if (marketState === "ACTIVE") {

            timer.textContent =
                "--:--";

            banner.textContent =
                "🟢 TRADE ACTIVE";

            action.textContent =
                "ACTIVE";

            entryMessage.textContent =
                "Trade is currently running.";

            return;
        }


        // ========================================
        // RESULT
        // ========================================

        if (marketState === "RESULT") {

            timer.textContent =
                "--:--";

            banner.textContent =
                "🏁 TRADE COMPLETE";

            action.textContent =
                "RESULT";

            entryMessage.textContent =
                "Trade completed. Waiting for the next setup.";

            return;
        }


        // ========================================
        // UNKNOWN
        // ========================================

        timer.textContent =
            countdownText;

        banner.textContent =
            "⚪ WAITING";

        action.textContent =
            "WAIT";

        entryMessage.textContent =
            "Waiting for the next valid setup.";
    }


    // ========================================
    // First Update
    // ========================================

    update();


    // ========================================
    // Update Frequently
    // ========================================
    //
    // 250ms keeps the display synchronized.
    // The actual calculation always comes from
    // Date.now(), so it does not drift.
    //
    countdownInterval =
        setInterval(
            update,
            250
        );
}