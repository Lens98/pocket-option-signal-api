// ============================================
// Pocket Option AI PRO
// popup.js
// Part 1 - Core Application
// ============================================

// -----------------------------
// Global State
// -----------------------------

let currentCandles = [];

let mouseX = null;
let mouseY = null;
let marketState = "WAITING";
let animation = 0;

// -----------------------------
// Canvas
// -----------------------------

const canvas = document.getElementById("miniChart");

// -----------------------------
// Mouse Events
// -----------------------------

if (canvas) {

    canvas.addEventListener("mousemove", (e) => {

        const rect = canvas.getBoundingClientRect();

        mouseX = e.clientX - rect.left;

        mouseY = e.clientY - rect.top;

        drawChart(currentCandles);

    });

    canvas.addEventListener("mouseleave", () => {

        mouseX = null;

        mouseY = null;

        drawChart(currentCandles);

    });

}

// -----------------------------
// API
// -----------------------------

async function loadChart(asset) {

    const response = await fetch(

        `http://127.0.0.1:8000/market/history/${asset}`

    );

    const history = await response.json();

    return history.candles;

}


async function loadSignal() {

    const status = document.getElementById("status");

    try {


    const background =
        await chrome.runtime.sendMessage({
            type: "GET_STATE"
        });
    // 👇 STEP 3 GOES HERE

    if (background.connected) {

        status.innerHTML =
            "🟢 Connected";
        status.className = "status online";

    }
    else {

     status.innerHTML = "🔴 Offline";

        status.className =
            "status offline";

    }

    // Continue with the rest of loadSignal()


    marketState =
    background.tradeState;

          //------------------------
        // No Signal
        //------------------------

        if (!signal || signal.status) {

            document.getElementById("action").innerHTML = "WAIT";

            document.getElementById("action").className =
                "action wait";

            document.getElementById("confidenceText").innerHTML =
                "0%";

            document.getElementById("trend").innerHTML =
                "---";

            document.getElementById("risk").innerHTML =
                "---";

            document.getElementById("asset").innerHTML =
                "---";

            document.getElementById("expiration").innerHTML =
                "---";

            document.getElementById("analysis").innerHTML =
                "Waiting for analysis...";

            document.getElementById("updated").innerHTML =
                new Date().toLocaleTimeString();

            return;

        }

        //------------------------
// Action
//------------------------

const actionElement =
    document.getElementById("action");

actionElement.innerHTML =
    signal.action;

actionElement.className =
    "action " +
    signal.action.toLowerCase();

const percent = signal.confidence;


        document.getElementById(

            "confidenceText"

        ).innerHTML =
            `${percent}%`;

        const circumference = 377;

        const offset =
            circumference -
            (percent / 100) *
            circumference;

        const gauge =
            document.getElementById(
                "gauge"
            );

        gauge.style.strokeDashoffset =
            offset;

        if (percent >= 80) {

            gauge.style.stroke =
                "#22C55E";

        }

        else if (percent >= 60) {

            gauge.style.stroke =
                "#FACC15";

        }

        else {

            gauge.style.stroke =
                "#EF4444";

        }

        //------------------------
        // Cards
        //------------------------

        document.getElementById("trend").innerHTML =
            signal.trend;

        document.getElementById("risk").innerHTML =
            signal.risk;

       document.getElementById("asset").innerHTML =
    signal.asset
        .replace("_otc"," OTC")
        .toUpperCase();

        document.getElementById("expiration").innerHTML =
            signal.expiration;
        document.getElementById("probability").innerHTML =
    `${signal.probability}%`;

document.getElementById("grade").innerHTML =
    signal.grade;

document.getElementById("session").innerHTML =
    signal.session;

document.getElementById("regime").innerHTML =
    signal.regime;
                    //------------------------
        // AI Analysis
        //------------------------

        renderAnalysis(signal);

        //------------------------
        // Signal History
        //------------------------

        const history = background.history;

            renderHistory(history);
        
        //------------------------
        // Statistics
        //------------------------

       const stats = background.stats;

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

        //------------------------
        // Load Real Candle History
        //------------------------

  currentCandles =
    await loadChart(signal.asset);

drawChart(currentCandles);

//--------------------------------
// Update Header
//--------------------------------

if(currentCandles.length){

    const last =
        currentCandles[
            currentCandles.length - 1
        ];

    document.getElementById(
        "chartAsset"
    ).innerHTML =
        signal.asset
        .replace("_otc"," OTC")
        .toUpperCase();

    document.querySelector(
        ".chart-price"
    ).innerHTML =
        Number(last.close)
        .toFixed(5);

}
    //----------------------------------
// Update Chart Header
//----------------------------------

document.getElementById("chartAsset").innerHTML =
    signal.asset.replace("_otc", " OTC");

if (currentCandles.length > 0) {

    const last =
        currentCandles[currentCandles.length - 1];

    document.querySelector(".chart-price").innerHTML =
        Number(last.close).toFixed(5);

}

console.log(
    "Chart Candles:",
    currentCandles
);

drawChart(currentCandles);

        //------------------------
        // Last Updated
        //------------------------

        document.getElementById("updated").innerHTML =
            new Date().toLocaleTimeString();

    }

   catch (err) {

    console.error("Popup Error:");

    console.error(err);

    status.className = "status offline";

    status.innerHTML = "🔴 Offline";

}

}

// ========================================
// Auto Refresh
// ========================================

loadSignal();
startCountdown();
setInterval(loadSignal, 1000);


// ========================================
// Signal History
// ========================================

function renderHistory(history) {

    const container =
        document.getElementById("history");

    container.innerHTML = "";

    if (!history || history.length === 0) {

        container.innerHTML =
            "No signals yet";

        return;

    }

    history.forEach(signal => {

        const row =
            document.createElement("div");

        row.className =
            "history-item";

        let color = "wait-text";

        if (signal.action === "CALL") {

            color = "call-text";

        }
        else if (signal.action === "PUT") {

            color = "put-text";

        }

        row.innerHTML = `

            <span>${new Date(signal.time).toLocaleTimeString()}</span>

            <span class="${color}">
                ${signal.action}
            </span>

            <span>
                ${signal.confidence}%
            </span>

        `;

        container.appendChild(row);

    });

}

function renderAnalysis(signal) {

    const container =
        document.getElementById("analysis");

    container.innerHTML = "";

    if (!signal.reasons ||
        signal.reasons.length === 0) {

        container.innerHTML =
            "Waiting for analysis...";

        return;

    }

    signal.reasons.forEach(reason => {

        const div =
            document.createElement("div");

        div.className =
            "reason";

        let icon = "⚠";
        let cls = "warning";

        if (signal.action === "CALL") {

            icon = "✔";
            cls = "good";

        }

        if (signal.action === "PUT") {

            icon = "✔";
            cls = "bad";

        }

        div.innerHTML = `

            <span class="${cls}">
                ${icon}
            </span>

            ${reason}

        `;

        container.appendChild(div);

    });

}

// ========================================
// Statistics
// ========================================
function drawChart(candles) {
    console.log("drawChart()", candles.length);
if (!candles || candles.length === 0) {

    console.log("No candles to draw");

    return;

}
const canvas = document.getElementById("miniChart");

if (!canvas) {
    return;
}

const ctx = canvas.getContext("2d");

const W = canvas.width;
const H = canvas.height;

animation += 0.08;

//----------------------------------
// Clear
//----------------------------------

ctx.clearRect(0, 0, W, H);

//----------------------------------
// Debug Square
//----------------------------------

ctx.fillStyle = "#FF0000";
ctx.fillRect(0, 0, 40, 40);

    //----------------------------------
    // Background
    //----------------------------------

    const gradient = ctx.createLinearGradient(
        0,
        0,
        0,
        H
    );

    gradient.addColorStop(0, "#18263F");
    gradient.addColorStop(1, "#0B1220");

    ctx.fillStyle = gradient;

    ctx.fillRect(
        0,
        0,
        W,
        H
    );

    //----------------------------------
    // Grid
    //----------------------------------

    ctx.strokeStyle = "#22324C";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {

        const y = (H / 4) * i;

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(W, y);

        ctx.stroke();

    }

    for (let i = 0; i <= 7; i++) {

        const x = (W / 7) * i;

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(x, H);

        ctx.stroke();

    }
   

const max = Math.max(
    ...candles.map(c => Number(c.high))
);

const min = Math.min(
    ...candles.map(c => Number(c.low))
);

const padding = (max - min) * 0.15;

const top = max + padding;

const bottom = min - padding;

const scale = price => {

    return (

        H - 10 -

        (

            (Number(price) - bottom)

            /

            (top - bottom)

        ) * (H - 20)

    );

};

    //----------------------------------
    // Candles
    //----------------------------------

    const spacing =
        (W - 20) / candles.length;

    const candleWidth =
        Math.min(
            12,
            spacing * 0.6
        );

    candles.forEach((candle, index) => {

        const x =
            10 +
            index * spacing +
            Math.sin(animation) * 0.2;

        const openY =
            scale(candle.open);

        const closeY =
            scale(candle.close);

        const highY =
            scale(candle.high);

        const lowY =
            scale(candle.low);

        const bullish =
            Number(candle.close) >=
            Number(candle.open);

        //--------------------------------
        // Wick
        //--------------------------------

        ctx.strokeStyle =
            bullish
                ? "#22C55E"
                : "#EF4444";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(
            x + candleWidth / 2,
            highY
        );

        ctx.lineTo(
            x + candleWidth / 2,
            lowY
        );

        ctx.stroke();

        //--------------------------------
        // Body
        //--------------------------------

        ctx.shadowBlur = 8;

        ctx.shadowColor =
            bullish
                ? "#22C55E"
                : "#EF4444";

        ctx.fillStyle =
            bullish
                ? "#22C55E"
                : "#EF4444";

        const top =
            Math.min(openY, closeY);

        const bodyHeight =
            Math.max(
                Math.abs(closeY - openY),
                3
            );

        ctx.fillRect(
            x,
            top,
            candleWidth,
            bodyHeight
        );

        ctx.shadowBlur = 0;

    });

    //----------------------------------
    // Current Price
    //----------------------------------

    const last =
        candles[candles.length - 1];

    const priceY =
        scale(last.close);

    const bullish =
        Number(last.close) >=
        Number(last.open);

    ctx.strokeStyle =
        bullish
            ? "#22C55E"
            : "#EF4444";

    ctx.setLineDash([6, 6]);

    ctx.beginPath();

    ctx.moveTo(
        0,
        priceY
    );

    ctx.lineTo(
        W,
        priceY
    );

    ctx.stroke();

    ctx.setLineDash([]);

    //----------------------------------
    // Price Label
    //----------------------------------

    ctx.fillStyle =
        bullish
            ? "#22C55E"
            : "#EF4444";

    ctx.font =
        "bold 12px Segoe UI";

    ctx.fillText(

        Number(last.close).toFixed(5),

        W - 55,

        priceY - 6

    );

    //----------------------------------
    // Crosshair
    //----------------------------------

    if (
        mouseX !== null &&
        mouseY !== null
    ) {

        ctx.strokeStyle =
            "#64748B";

        ctx.setLineDash([4, 4]);

        ctx.beginPath();

        ctx.moveTo(
            mouseX,
            0
        );

        ctx.lineTo(
            mouseX,
            H
        );

        ctx.stroke();

        ctx.beginPath();

        ctx.moveTo(
            0,
            mouseY
        );

        ctx.lineTo(
            W,
            mouseY
        );

        ctx.stroke();

        ctx.setLineDash([]);

    }
}
 // ========================================
// Countdown Timer
// ========================================
let countdownInterval = null;
function startCountdown() {

    if (countdownInterval) {
        clearInterval(countdownInterval);
    }

    const timer = document.getElementById("countdown");

    function update() {

        const now = new Date();

        const remaining = 60 - now.getSeconds();

        timer.innerHTML =
            `00:${String(remaining).padStart(2, "0")}`;

        // --------------------------------
        // Banner
        // --------------------------------

       const banner =
    document.getElementById("buyBanner");

const action =
    document.getElementById("action").innerHTML;

switch (marketState) {

    case "WAITING":

        banner.innerHTML =
            "🟡 WAIT FOR NEXT CANDLE";

        banner.className =
            "buy-banner wait";

        break;

    case "ANALYZING":

        banner.innerHTML =
            "🔵 ANALYZING MARKET";

        banner.className =
            "buy-banner wait";

        break;

    case "READY":

        banner.innerHTML =
            "🟢 READY FOR ENTRY";

        banner.className =
            "buy-banner call";

        break;

    case "ENTRY":

        if (action === "CALL") {

            banner.innerHTML =
                "🟢 BUY CALL NOW";

            banner.className =
                "buy-banner call";

        }
        else if (action === "PUT") {

            banner.innerHTML =
                "🔴 BUY PUT NOW";

            banner.className =
                "buy-banner put";

        }
        else {

            banner.innerHTML =
                "🟡 WAIT";

            banner.className =
                "buy-banner wait";

        }

        break;

    case "ACTIVE":

        banner.innerHTML =
            "🔴 TRADE ACTIVE";

        banner.className =
            "buy-banner put";

        break;

    case "FINISHED":

        banner.innerHTML =
            "✅ TRADE FINISHED";

        banner.className =
            "buy-banner wait";

        break;

        case "LEARNING":

    banner.innerHTML =
        "🧠 AI LEARNING";

    banner.className =
        "buy-banner wait";

    break;


default:

    banner.innerHTML =
        "🟡 WAIT FOR NEXT CANDLE";

    banner.className =
        "buy-banner wait";

    break;

}   // closes switch

}   // closes update()

update();

countdownInterval =
    setInterval(update, 1000);

}   // closes startCountdown()