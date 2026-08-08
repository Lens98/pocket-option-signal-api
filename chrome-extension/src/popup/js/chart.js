let canvas = null;
let ctx = null;
let candles = [];
export function initChart() {

    canvas = document.getElementById("miniChart");

    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;

    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;

    ctx = canvas.getContext("2d");

    ctx.scale(dpr, dpr);

}

export function setCandles(data) {

    candles = Array.isArray(data) ? data : [];

    drawChart();

}

export function drawChart() {

    console.log("Drawing", candles.length, "candles");
    if (!ctx || !canvas) return;

    ctx.clearRect(
        0,
        0,
        canvas.clientWidth,
        canvas.clientHeight
    );

    drawBackground();

    drawGrid();

    if (candles.length === 0) {

        ctx.fillStyle = "#94A3B8";

        ctx.font = "15px Segoe UI";

        ctx.fillText(

            "Waiting for market data...",

            20,

            35

        );

        return;

    }

    drawCandles();

}
function drawBackground(){

    const gradient = ctx.createLinearGradient(

        0,

        0,

        0,

        canvas.clientHeight

    );

    gradient.addColorStop(0,"#101827");

    gradient.addColorStop(1,"#0B1220");

    ctx.fillStyle = gradient;

    ctx.fillRect(

        0,

        0,

        canvas.clientWidth,

        canvas.clientHeight

    );

}

function drawGrid(){

    const w = canvas.clientWidth;

    const h = canvas.clientHeight;

    ctx.strokeStyle="#1E293B";

    ctx.lineWidth=1;

    for(let i=0;i<=5;i++){

        const y=h/5*i;

        ctx.beginPath();

        ctx.moveTo(0,y);

        ctx.lineTo(w,y);

        ctx.stroke();

    }

    for(let i=0;i<=8;i++){

        const x=w/8*i;

        ctx.beginPath();

        ctx.moveTo(x,0);

        ctx.lineTo(x,h);

        ctx.stroke();

    }

}

function drawCandles() {

    const visible = candles.slice(-50);

    const highs = visible.map(c => c.high);
    const lows = visible.map(c => c.low);

   const max = Math.max(...highs);

const min = Math.min(...lows);

const padding = (max-min)*0.08;

const highest = max+padding;

const lowest = min-padding;

const range = highest-lowest;

    const candleWidth = canvas.width / visible.length;

    visible.forEach((candle, i) => {

        const x = i * candleWidth + candleWidth / 2;

        const yOpen =
            canvas.height -
            ((candle.open - min) / range) * canvas.height;

        const yClose =
            canvas.height -
            ((candle.close - min) / range) * canvas.height;

        const yHigh =
            canvas.height -
            ((candle.high - min) / range) * canvas.height;

        const yLow =
            canvas.height -
            ((candle.low - min) / range) * canvas.height;

        const bullish = candle.close >= candle.open;

        ctx.strokeStyle = bullish ? "#22C55E" : "#EF4444";
        ctx.fillStyle = bullish ? "#22C55E" : "#EF4444";

        // Wick
        ctx.beginPath();
        ctx.moveTo(x, yHigh);
        ctx.lineTo(x, yLow);
        ctx.stroke();

        // Body
        const bodyTop = Math.min(yOpen, yClose);
        const bodyHeight = Math.max(
            Math.abs(yClose - yOpen),
            2
        );

        ctx.fillRect(
            x - candleWidth * 0.25,
            bodyTop,
            candleWidth * 0.5,
            bodyHeight
        );
        if(i===visible.length-1){

    ctx.shadowColor=ctx.fillStyle;

    ctx.shadowBlur=12;

    ctx.fillRect(

        x-candleWidth*.25,

        bodyTop,

        candleWidth*.5,

        bodyHeight

    );

    ctx.shadowBlur=0;

}

    });

}