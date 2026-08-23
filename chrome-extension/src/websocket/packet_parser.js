export class PacketParser {

    static parse(text) {

        try {

            const packet = JSON.parse(text);

            if (!Array.isArray(packet)) return null;

            if (!Array.isArray(packet[0])) return null;

            const tick = packet[0];

            if (tick.length < 3) return null;

            return {

                asset: tick[0],

                timestamp: tick[1],

                price: tick[2]

            };

        } catch {

            return null;

        }

    }

}