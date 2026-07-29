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
        document.getElementById("buyBanner");

    const action =
        document.getElementById("action");

    const entryMessage =
        document.getElementById("entryMessage");

    function update() {

        const now = new Date();

        const remaining =
            60 - now.getSeconds();

        timer.innerHTML =
            `00:${String(remaining).padStart(2,"0")}`;

        const marketState =
            getMarketState();

        // Countdown state logic will go here.

    }

    update();

    countdownInterval =
        setInterval(update,1000);

}