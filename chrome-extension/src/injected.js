console.log("✅ Injected script loaded.");

const NativeWebSocket = window.WebSocket;

/* ==========================================
   TICK VALIDATION
========================================== */

function isValidTick(value) {
    if (!Array.isArray(value)) {
        return false;
    }

    if (value.length !== 3) {
        return false;
    }

    const asset = value[0];
    const timestamp = value[1];
    const price = value[2];

    if (typeof asset !== "string") {
        return false;
    }

    if (typeof timestamp !== "number") {
        return false;
    }

    if (typeof price !== "number") {
        return false;
    }

    if (!asset.trim()) {
        return false;
    }

    if (!Number.isFinite(timestamp)) {
        return false;
    }

    if (!Number.isFinite(price)) {
        return false;
    }

    if (price <= 0) {
        return false;
    }

    return true;
}

/* ==========================================
   SEND TICK
========================================== */

function sendTick(tick) {

    const asset = tick[0];
    const timestamp = tick[1];
    const price = tick[2];

    console.log("======================================");
    console.log("📈 POCKET OPTION TICK");
    console.log("Asset     :", asset);
    console.log("Timestamp :", timestamp);
    console.log("Price     :", price);
    console.log("======================================");

    window.postMessage(
        {
            type: "POCKET_OPTION_TICK",

            data: {
                asset,
                timestamp,
                price
            }
        },
        "*"
    );
}

/* ==========================================
   SEARCH OBJECT / ARRAY FOR TICK
========================================== */

function findTick(value, visited = new Set()) {

    if (
        value === null ||
        value === undefined
    ) {
        return null;
    }

    if (
        typeof value === "object"
        &&
        visited.has(value)
    ) {
        return null;
    }

    if (typeof value === "object") {
        visited.add(value);
    }

    /* --------------------------------------
       Direct tick:
       ["EURUSD_otc", 1234567890, 1.12345]
    -------------------------------------- */

    if (isValidTick(value)) {
        return value;
    }

    /* --------------------------------------
       Object tick
    -------------------------------------- */

    if (
        typeof value === "object"
        &&
        !Array.isArray(value)
    ) {

        const asset =
            value.asset ??
            value.symbol ??
            value.instrument;

        const timestamp =
            value.timestamp ??
            value.time ??
            value.ts;

        const price =
            value.price ??
            value.close ??
            value.rate;

        if (
            typeof asset === "string" &&
            typeof timestamp === "number" &&
            typeof price === "number"
        ) {

            if (
                asset.trim() &&
                Number.isFinite(timestamp) &&
                Number.isFinite(price) &&
                price > 0
            ) {

                return [
                    asset,
                    timestamp,
                    price
                ];
            }
        }
    }

    /* --------------------------------------
       Recursive search
    -------------------------------------- */

    if (Array.isArray(value)) {

        for (const item of value) {

            const result =
                findTick(item, visited);

            if (result) {
                return result;
            }
        }

    }

    else if (typeof value === "object") {

        for (const key of Object.keys(value)) {

            const result =
                findTick(value[key], visited);

            if (result) {
                return result;
            }
        }
    }

    return null;
}

/* ==========================================
   PARSE JSON TEXT
========================================== */

function parseTextMessage(text) {

    if (
        typeof text !== "string" ||
        !text.trim()
    ) {
        return;
    }

    const trimmed = text.trim();

    /*
     * Try normal JSON first.
     */

    try {

        const parsed =
            JSON.parse(trimmed);

        const tick =
            findTick(parsed);

        if (tick) {

            sendTick(tick);

            return true;
        }

    }
    catch (error) {
        // Continue with Socket.IO parsing.
    }

    /*
     * Socket.IO / Engine.IO messages can contain
     * a JSON payload after a numeric prefix.
     *
     * Example:
     *
     * 42["event", {...}]
     */

    const jsonStart =
        trimmed.search(/[\[\{]/);

    if (jsonStart >= 0) {

        const possibleJson =
            trimmed.slice(jsonStart);

        try {

            const parsed =
                JSON.parse(possibleJson);

            const tick =
                findTick(parsed);

            if (tick) {

                sendTick(tick);

                return true;
            }

        }
        catch (error) {
            // Not a JSON payload.
        }
    }

    return false;
}

/* ==========================================
   PARSE BINARY MESSAGE
========================================== */

function parseBinaryMessage(data) {

    try {

        const bytes =
            new Uint8Array(data);

        console.log("========== BINARY ==========");
        console.log("Length:", bytes.length);

        const text =
            new TextDecoder().decode(bytes);

        console.log("========== DECODED ==========");
        console.log(text);

        return parseTextMessage(text);

    }
    catch (error) {

        console.error(
            "❌ Binary message parse error:",
            error
        );

        return false;
    }
}

/* ==========================================
   WEBSOCKET OVERRIDE
========================================== */

window.WebSocket = function (...args) {

    console.log(
        "Opening WebSocket:",
        args[0]
    );

    const socket =
        new NativeWebSocket(...args);

    socket.binaryType =
        "arraybuffer";

    socket.addEventListener(
        "message",
        (event) => {

            /* ==============================
               BINARY
            ============================== */

            if (
                event.data instanceof
                ArrayBuffer
            ) {

                parseBinaryMessage(
                    event.data
                );

                return;
            }

            /* ==============================
               BLOB
            ============================== */

            if (
                event.data instanceof Blob
            ) {

                event.data
                    .arrayBuffer()
                    .then(buffer => {

                        parseBinaryMessage(
                            buffer
                        );

                    })
                    .catch(error => {

                        console.error(
                            "❌ Blob parse error:",
                            error
                        );

                    });

                return;
            }

            /* ==============================
               TEXT
            ============================== */

            if (
                typeof event.data === "string"
            ) {

                console.log(
                    "========== TEXT =========="
                );

                console.log(
                    event.data
                );

                const tickFound =
                    parseTextMessage(
                        event.data
                    );

                /*
                 * Keep forwarding text messages
                 * for debugging/other consumers.
                 */

                window.postMessage(
                    {
                        type:
                            "POCKET_OPTION_TEXT",

                        text:
                            event.data,

                        tickFound
                    },
                    "*"
                );
            }
        }
    );

    return socket;
};

/* ==========================================
   PRESERVE WEBSOCKET API
========================================== */

window.WebSocket.prototype =
    NativeWebSocket.prototype;

window.WebSocket.CONNECTING =
    NativeWebSocket.CONNECTING;

window.WebSocket.OPEN =
    NativeWebSocket.OPEN;

window.WebSocket.CLOSING =
    NativeWebSocket.CLOSING;

window.WebSocket.CLOSED =
    NativeWebSocket.CLOSED;