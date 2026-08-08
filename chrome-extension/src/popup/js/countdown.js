let countdownInterval = null;

export function stopCountdown() {

    if (countdownInterval) {

        clearInterval(countdownInterval);

        countdownInterval = null;

    }

}

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

        const now = new Date();

        const remaining =
            60 - now.getSeconds();

        timer.innerHTML =
            `00:${String(remaining).padStart(2, "0")}`;

        const marketState =
            getMarketState();

        // =====================================
        // Countdown State Machine
        // =====================================

        if (marketState === "WAITING") {

            banner.innerHTML = "🟡 WAITING FOR SETUP";

            action.innerHTML = "WAIT";

            entryMessage.innerHTML =
                "Waiting for a valid trade setup.";

        }

        else if (marketState === "READY") {

            banner.innerHTML = "🟢 PREPARING ENTRY";

            action.innerHTML = "READY";

            entryMessage.innerHTML =
                `Wait ${remaining} seconds for the candle to close.`;

        }

        else if (marketState === "WAITING_FOR_CANDLE_CLOSE") {

            banner.innerHTML = "⏳ WAITING FOR CANDLE CLOSE";

            action.innerHTML = "WAIT";

            entryMessage.innerHTML =
                `Current candle ends in ${remaining} sec.`;

        }

        else if (marketState === "ENTRY") {

            if (remaining <= 3 && remaining > 0) {

                banner.innerHTML = "🟢 GET READY";

                action.innerHTML =
                    `ENTRY IN ${remaining}`;

                entryMessage.innerHTML =
                    `Prepare to enter in ${remaining} second(s).`;

            }

            else if (remaining === 60) {

                banner.innerHTML = "🚀 ENTER NOW";

                action.innerHTML = "🚀 ENTER NOW";

                entryMessage.innerHTML =
                    "New candle opened. Enter now.";

            }

            else {

                banner.innerHTML = "❌ ENTRY WINDOW MISSED";

                action.innerHTML = "MISSED";

                entryMessage.innerHTML =
                    "Wait for the next trade setup.";

            }

        }

        else if (marketState === "ACTIVE") {

            banner.innerHTML = "🟢 TRADE ACTIVE";

            action.innerHTML = "ACTIVE";

            entryMessage.innerHTML =
                "Trade is currently running.";

        }

        else if (marketState === "RESULT") {

            banner.innerHTML = "🏁 TRADE COMPLETE";

            action.innerHTML = "RESULT";

            entryMessage.innerHTML =
                "Waiting for the next setup.";

        }

    }

    update();

    countdownInterval =
        setInterval(update, 1000);

}