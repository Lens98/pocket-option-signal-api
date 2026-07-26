const signalHistory = [];
let stats = {

    CALL:0,

    PUT:0,

    WAIT:0

};

async function loadSignal() {

    const status = document.getElementById("status");

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/signal"
        );

        const signal = await response.json();

        // -----------------------------
        // Connection Status
        // -----------------------------

        status.className = "status online";
        status.innerHTML = "● Connected";

        // -----------------------------
        // No Signal Yet
        // -----------------------------

        if (signal.status) {

            document.getElementById("action").innerHTML = "WAIT";
            document.getElementById("action").className = "action wait";

            document.getElementById("confidenceText").innerHTML = "0%";

            document.getElementById("gauge").style.strokeDashoffset = 377;

            document.getElementById("trend").innerHTML = "---";
            document.getElementById("risk").innerHTML = "---";
            document.getElementById("asset").innerHTML = "---";
            document.getElementById("expiration").innerHTML = "---";

            document.getElementById("updated").innerHTML =
                new Date().toLocaleTimeString();

                signalHistory.unshift({

    asset: signal.asset,

    action: signal.action,

    confidence: signal.confidence

});

if (signalHistory.length > 10) {

    signalHistory.pop();

}

renderHistory();
updateStats(signal.action);
            return;

        }

        // -----------------------------
        // Signal
        // -----------------------------

        const action = document.getElementById("action");

        action.innerHTML = signal.action;

        action.className = "action";

        if (signal.action === "CALL") {

            action.classList.add("call");

        }

        else if (signal.action === "PUT") {

            action.classList.add("put");

        }

        else {

            action.classList.add("wait");

        }

        // -----------------------------
        // Circular Confidence Gauge
        // -----------------------------

        const percent = signal.confidence;

        document.getElementById("confidenceText").innerHTML =
            `${percent}%`;

        const circumference = 377;

        const offset =
            circumference -
            (percent / 100) * circumference;

        const gauge = document.getElementById("gauge");

        gauge.style.strokeDashoffset = offset;

        // Optional: Change gauge color

        if (signal.action === "CALL") {

            gauge.style.stroke = "#22C55E";

        }

        else if (signal.action === "PUT") {

            gauge.style.stroke = "#EF4444";

        }

        else {

            gauge.style.stroke = "#F59E0B";

        }

        // -----------------------------
        // Info Cards
        // -----------------------------

        document.getElementById("trend").innerHTML =
            signal.trend;

        document.getElementById("risk").innerHTML =
            signal.risk;

        document.getElementById("asset").innerHTML =
            signal.asset;

        document.getElementById("expiration").innerHTML =
            signal.expiration;

        // -----------------------------
        // Last Updated
        // -----------------------------

        document.getElementById("updated").innerHTML =
            new Date().toLocaleTimeString();
renderAnalysis(signal);
    }

    catch (err) {

        console.error(err);

        status.className = "status offline";
        status.innerHTML = "● Offline";

    }

}

loadSignal();

setInterval(loadSignal, 1000);
function renderHistory() {

    const container = document.getElementById("history");

    container.innerHTML = "";

    signalHistory.forEach(signal => {

        const div = document.createElement("div");

        div.className = "history-item";

        let cls = "wait-text";

        if (signal.action === "CALL") {

            cls = "call-text";

        }

        if (signal.action === "PUT") {

            cls = "put-text";

        }

        div.innerHTML = `

            <span class="${cls}">

                ${signal.action}

            </span>

            <span>

                ${signal.confidence}%

            </span>

            <span>

                ${signal.asset}

            </span>

        `;

        container.appendChild(div);

    });

    if (signalHistory.length === 0) {

        container.innerHTML = "No signals yet";

    }

}

function renderAnalysis(signal){

    const container =
        document.getElementById("analysis");

    container.innerHTML = "";

    if(signal.reasons){

        signal.reasons.forEach(reason=>{

            const div =
                document.createElement("div");

            div.className="reason";

            let icon="⚠";

            let cls="warning";

            if(signal.action==="CALL"){

                icon="✔";

                cls="good";

            }

            if(signal.action==="PUT"){

                icon="✔";

                cls="bad";

            }

            div.innerHTML=`
                <span class="${cls}">
                    ${icon}
                </span>
                ${reason}
            `;

            container.appendChild(div);

        });

    }

    else{

        container.innerHTML=
            "Waiting for analysis...";

    }

}

function updateStats(action){

    if(stats[action] !== undefined){

        stats[action]++;

    }

    document.getElementById("callCount").innerHTML =
        stats.CALL;

    document.getElementById("putCount").innerHTML =
        stats.PUT;

    document.getElementById("waitCount").innerHTML =
        stats.WAIT;

    document.getElementById("totalCount").innerHTML =
        stats.CALL +
        stats.PUT +
        stats.WAIT;

}