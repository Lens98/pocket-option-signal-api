const signalHistory = [];
let mouseX = null;
let mouseY = null;
const canvas = document.getElementById("miniChart");

if(canvas){

    canvas.addEventListener("mousemove",(e)=>{

        const rect = canvas.getBoundingClientRect();

        mouseX = e.clientX - rect.left;

        mouseY = e.clientY - rect.top;

        drawFakeChart();

    });

    canvas.addEventListener("mouseleave",()=>{

        mouseX = null;
        mouseY = null;

        drawFakeChart();

    });

}
let animation = 0;
let chart = null;
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
const gauge =
    document.getElementById("gauge");

gauge.style.strokeDashoffset = offset;

if(percent>=80){

    gauge.style.stroke="#22C55E";

}

else if(percent>=60){

    gauge.style.stroke="#FACC15";

}

else{

    gauge.style.stroke="#EF4444";

}

            document.getElementById("trend").innerHTML = "---";
            document.getElementById("risk").innerHTML = "---";
            document.getElementById("asset").innerHTML = "---";
            document.getElementById("expiration").innerHTML = "---";

            document.getElementById("updated").innerHTML =
                new Date().toLocaleTimeString();
                drawFakeChart();


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
function drawFakeChart() {

    const canvas = document.getElementById("miniChart");

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const W = canvas.width;
    const H = canvas.height;

    animation += 0.08;

ctx.clearRect(
    0,
    0,
    W,
    H
);

    // Background
    ctx.fillStyle = "#0F172A";
    ctx.fillRect(0, 0, W, H);
    ctx.shadowBlur = 0;

    //--------------------------------
// Current Price Line
//--------------------------------

const last = candles[candles.length - 1];

const priceY = scale(last.close);

ctx.strokeStyle =
    last.close >= last.open
        ? "#22C55E"
        : "#EF4444";

ctx.setLineDash([6, 6]);

ctx.beginPath();

ctx.moveTo(0, priceY);

ctx.lineTo(W, priceY);

ctx.stroke();

ctx.setLineDash([]);

//--------------------------------
// Price Label
//--------------------------------

ctx.fillStyle =
    last.close >= last.open
        ? "#22C55E"
        : "#EF4444";

ctx.font = "bold 12px Segoe UI";

ctx.fillText(
    last.close.toFixed(2),
    W - 45,
    priceY - 5
);

} 
if(mouseX!==null){

    ctx.strokeStyle="#475569";

    ctx.setLineDash([4,4]);

    ctx.beginPath();

    ctx.moveTo(mouseX,0);

    ctx.lineTo(mouseX,H);

    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(0,mouseY);

    ctx.lineTo(W,mouseY);

    ctx.stroke();

    ctx.setLineDash([]);

}
// <-- End of drawFakeChart()
    //--------------------------------
// Grid
//--------------------------------

ctx.strokeStyle = "#1E293B";

ctx.lineWidth = 1;

// Horizontal

for(let i=0;i<5;i++){

    const y = i*(H/4);

    ctx.beginPath();

    ctx.moveTo(0,y);

    ctx.lineTo(W,y);

    ctx.stroke();

}

// Vertical

for(let i=0;i<8;i++){

    const x = i*(W/7);

    ctx.beginPath();

    ctx.moveTo(x,0);

    ctx.lineTo(x,H);

    ctx.stroke();

}

    // Horizontal Grid
    ctx.strokeStyle = "#1E293B";
    ctx.lineWidth = 1;

    for (let i = 1; i < 5; i++) {

        const y = (H / 5) * i;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();

    }

    //------------------------------------------------
    // Fake Candles
    //------------------------------------------------

    const candles = [

        {open:50, high:70, low:45, close:65},
        {open:65, high:80, low:60, close:72},
        {open:72, high:78, low:58, close:61},
        {open:61, high:68, low:55, close:66},
        {open:66, high:90, low:62, close:88},
        {open:88, high:92, low:74, close:78},
        {open:78, high:95, low:70, close:91},
        {open:91, high:98, low:84, close:95},
        {open:95, high:99, low:80, close:82},
        {open:82, high:86, low:75, close:84},
        {open:84, high:100, low:82, close:98},
        {open:98, high:105, low:90, close:93}

    ];

    //------------------------------------------------
    // Scale
    //------------------------------------------------

    const max = Math.max(...candles.map(c => c.high));

    const min = Math.min(...candles.map(c => c.low));

    const scale = value => {

        return H - ((value - min) / (max - min)) * (H - 20) - 10;

    };

    //------------------------------------------------
    // Draw Candles
    //------------------------------------------------

    const candleWidth = 14;

    const spacing = 12;

    candles.forEach((candle, index) => {

       const x =
    15 +
    index *
    (candleWidth + spacing) +
    Math.sin(animation) * 0.3;

        const openY = scale(candle.open);

        const closeY = scale(candle.close);

        const highY = scale(candle.high);

        const lowY = scale(candle.low);

        const bullish = candle.close >= candle.open;

        //--------------------------------------------
        // Wick
        //--------------------------------------------

        ctx.strokeStyle = bullish
            ? "#22C55E"
            : "#EF4444";

        ctx.lineWidth = 2;

        ctx.beginPath();

        ctx.moveTo(x + candleWidth / 2, highY);

        ctx.lineTo(x + candleWidth / 2, lowY);

        ctx.stroke();

        //--------------------------------------------
        // Body
        //--------------------------------------------

      ctx.shadowBlur = 8;

ctx.shadowColor = bullish
    ? "#22C55E"
    : "#EF4444";

ctx.fillStyle = bullish
    ? "#22C55E"
    : "#EF4444";

        const top = Math.min(openY, closeY);

        const height = Math.max(
            Math.abs(closeY - openY),
            3
        );

                ctx.fillRect(
            x,
            top,
            candleWidth,
            height
        );

    });

}