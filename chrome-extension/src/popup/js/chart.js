let canvas = null;
let ctx = null;
let candles = [];

export function initChart() {

    canvas = document.getElementById("miniChart");

    if (!canvas) return;

    ctx = canvas.getContext("2d");

}

export function setCandles(data) {

    candles = Array.isArray(data) ? data : [];

    drawChart();

}

export function drawChart() {

    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();

    if (candles.length === 0) {

        ctx.fillStyle = "#94A3B8";
        ctx.font = "18px Segoe UI";
        ctx.fillText(
            "Waiting for market data...",
            20,
            40
        );

        return;

    }

    drawCandles();

}

function drawGrid() {

    ctx.strokeStyle = "#1E293B";

    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {

        const y = (canvas.height / 5) * i;

        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

    }

}

function drawCandles() {

    const visible = candles.slice(-50);

    const highs = visible.map(c => c.high);
    const lows = visible.map(c => c.low);

    const max = Math.max(...highs);
    const min = Math.min(...lows);

    const range = max - min || 1;

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

    });

}