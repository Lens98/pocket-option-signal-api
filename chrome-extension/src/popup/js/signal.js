/* ==========================================
   UPDATE SIGNAL CARD
========================================== */

export function updateSignal(signal = {}) {

    updateAction(signal);
    updateConfidence(signal);
    updateInfo(signal);
    updateStatus(signal);

}


/* ==========================================
   ACTION
========================================== */

function updateAction(signal) {

    const action =
        document.getElementById("action");

    if (!action) return;

    const rawAction =
        String(
             signal.next_candle_bias ||
             signal.action ||
             "WAIT"
        ).toUpperCase();
    const bias =
        String(
            signal.bias || ""
        ).toUpperCase();

    const marketState =
        String(
            signal.market_state || ""
        ).toUpperCase();

    const tradeStatus =
        String(
            signal.trade_status || ""
        ).toUpperCase();


    /*
       ========================================
       ACTIVE TRADE
       ========================================

       IMPORTANT:

       The backend may return:

           bias         = CALL
           action       = WAIT
           market_state = ACTIVE
           trade_status = ACTIVE

       That means the CALL trade is already
       running.

       We MUST NOT present CALL as a new
       entry signal.

       The direction is displayed separately
       in the status area.
    */

    const activeTrade =
        marketState === "ACTIVE" ||
        tradeStatus === "ACTIVE";


    let displayAction;


    if (activeTrade) {

        displayAction = "ACTIVE";

    }

    else {

        displayAction = rawAction;

    }


    /* ========================================
       UPDATE ACTION TEXT
    ======================================== */

    action.textContent =
        displayAction;


    action.className =
        "signal-action";


    /* ========================================
       ACTION STYLE
    ======================================== */

    switch (displayAction) {

        case "CALL":

            action.classList.add(
                "call"
            );

            break;


        case "PUT":

            action.classList.add(
                "put"
            );

            break;


        case "ACTIVE":

            action.classList.add(
                "wait"
            );

            break;


        case "WAIT":

        default:

            action.classList.add(
                "wait"
            );

            break;

    }

}


/* ==========================================
   CONFIDENCE
========================================== */

function updateConfidence(signal) {

    const confidence =
        document.getElementById(
            "confidence"
        );

    if (!confidence) return;


    const value =
        Number(
            signal.confidence
        );


    if (
        Number.isFinite(value)
    ) {

        confidence.textContent =
            `${Math.round(value)}%`;

    }

    else {

        confidence.textContent =
            "--";

    }

}


/* ==========================================
   SIGNAL INFO
========================================== */

function updateInfo(signal) {

    const trend =
        document.getElementById(
            "trend"
        );

    const risk =
        document.getElementById(
            "risk"
        );

    const expiration =
        document.getElementById(
            "expiration"
        );


    if (trend) {

        trend.textContent =
            signal.trend ?? "--";

    }


    if (risk) {

        risk.textContent =
            signal.risk ?? "--";

    }


    if (expiration) {

        expiration.textContent =
            signal.expiration ?? "--";

    }

}


/* ==========================================
   STATUS
========================================== */

function updateStatus(signal) {

    const status =
        document.getElementById(
            "signalStatus"
        );

    if (!status) return;


    const marketState =
        String(
            signal.market_state || ""
        ).toUpperCase();


    const tradeStatus =
        String(
            signal.trade_status || ""
        ).toUpperCase();


    const bias =
        String(
            signal.bias || ""
        ).toUpperCase();


    /* ========================================
       ACTIVE TRADE
    ======================================== */

    if (
        (
            marketState === "ACTIVE" ||
            tradeStatus === "ACTIVE"
        ) &&
        (
            bias === "CALL" ||
            bias === "PUT"
        )
    ) {

        status.textContent =
            `ACTIVE TRADE — ${bias}`;


        status.className =
            "active";


        return;

    }


    /* ========================================
       BACKEND REASON
    ======================================== */

    if (
        signal.reason &&
        String(
            signal.reason
        ).trim() !== ""
    ) {

        status.textContent =
            signal.reason;

        return;

    }


    /* ========================================
       NORMAL STATE
    ======================================== */

    status.textContent =
        signal.market_state ||
        "Waiting...";

}


/* ==========================================
   CONNECTION STATUS
========================================== */

export function updateConnectionStatus(
    online
) {

    const header =
        document.getElementById(
            "status"
        );

    const footer =
        document.getElementById(
            "statusText"
        );

    const updated =
        document.getElementById(
            "updated"
        );

    const engine =
        document.getElementById(
            "engineStatus"
        );


    if (!header || !footer) {

        return;

    }


    /* ========================================
       ONLINE
    ======================================== */

    if (online) {

        header.textContent =
            "🟢 Online";

        header.className =
            "status online";


        footer.textContent =
            "🟢 Connected";

        footer.className =
            "online";


        if (updated) {

            updated.textContent =
                new Date()
                    .toLocaleTimeString();

        }


        if (engine) {

            engine.textContent =
                "Running";

        }

    }


    /* ========================================
       OFFLINE
    ======================================== */

    else {

        header.textContent =
            "🔴 Offline";

        header.className =
            "status offline";


        footer.textContent =
            "🔴 Disconnected";

        footer.className =
            "offline";


        if (engine) {

            engine.textContent =
                "Offline";

        }

    }

}