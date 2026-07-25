console.log("✅ Injected script loaded.");

const NativeWebSocket = window.WebSocket;

window.WebSocket = function (...args) {

    console.log("Opening WebSocket:", args[0]);

    const socket = new NativeWebSocket(...args);

    socket.addEventListener("message", (event) => {

        // Binary messages
        if (event.data instanceof ArrayBuffer) {

            const bytes = new Uint8Array(event.data);

            console.log("========== BINARY ==========");
            console.log("Length:", bytes.length);

            const text = new TextDecoder().decode(bytes);

            console.log("========== DECODED ==========");
            console.log(text);

            try {

                const packet = JSON.parse(text);

                if (
                    Array.isArray(packet) &&
                    Array.isArray(packet[0]) &&
                    packet[0].length >= 3
                ) {

                    const tick = packet[0];

                    console.log("Sending tick to content script", {
                        asset: tick[0],
                        timestamp: tick[1],
                        price: tick[2]
                    });

                    window.postMessage({
                        type: "POCKET_OPTION_TICK",
                        data: {
                            asset: tick[0],
                            timestamp: tick[1],
                            price: tick[2]
                        }
                    }, "*");

                }

            } catch (err) {
                console.log("Non-JSON binary packet");
            }

            return;
        }

        // Text messages
        if (typeof event.data === "string") {

            console.log("========== TEXT ==========");
            console.log(event.data);

            window.postMessage({
                type: "POCKET_OPTION_TEXT",
                text: event.data
            }, "*");

        }

    });

    return socket;

};

window.WebSocket.prototype = NativeWebSocket.prototype;