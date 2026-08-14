/* ==========================================
   MARKET INFORMATION
========================================== */

export function updateMarket(
    signal = {},
    market = {}
) {

    const asset =
        signal.asset ||
        market.asset ||
        "---";


    const candles =
        Array.isArray(market.candles)
            ? market.candles
            : [];


    const latestCandle =
        candles.length > 0
            ? candles[candles.length - 1]
            : null;


    const price =
        signal.entry_price ??
        latestCandle?.close ??
        0;


    // ======================================
    // Dashboard
    // ======================================

    set(
        "asset",
        asset
    );

    set(
        "trend",
        signal.trend
    );

    set(
        "risk",
        signal.risk
    );

    set(
        "expiration",
        signal.expiration
    );

    set(
        "probability",
        `${Number(
            signal.probability ?? 0
        ).toFixed(1)}%`
    );

    set(
        "grade",
        signal.grade
    );

    set(
        "session",
        signal.session
    );

    set(
        "regime",
        signal.regime
    );


    // ======================================
    // Live Market Card
    // ======================================

    set(
        "chartAsset",
        asset
    );


    set(
        "chartPrice",
        Number(price).toFixed(5)
    );


    const chartChange =
        document.getElementById(
            "chartChange"
        );


    if (chartChange) {

        const trend =
            signal.trend ||
            "---";


        const session =
            signal.session ||
            "---";


        chartChange.textContent =
            `${trend} • ${session}`;


        chartChange.className =
            "market-change";


        if (
            trend === "BULLISH"
        ) {

            chartChange.classList.add(
                "bullish"
            );

        }

        else if (
            trend === "BEARISH"
        ) {

            chartChange.classList.add(
                "bearish"
            );

        }

        else {

            chartChange.classList.add(
                "neutral"
            );

        }

    }

}


/* ==========================================
   HELPER
========================================== */

function set(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (!element) {

        return;

    }


    element.textContent =
        value ?? "---";


    element.classList.remove(
        "BULLISH",
        "BEARISH",
        "SIDEWAYS",
        "LOW",
        "MEDIUM",
        "HIGH"
    );


    const colorValues = [

        "BULLISH",

        "BEARISH",

        "SIDEWAYS",

        "LOW",

        "MEDIUM",

        "HIGH"

    ];


    const upper =
        String(
            value ?? ""
        ).toUpperCase();


    if (
        colorValues.includes(
            upper
        )
    ) {

        element.classList.add(
            upper
        );

    }

}