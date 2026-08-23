export class Decoder {

    static decode(data) {

        if (data instanceof ArrayBuffer) {

            return new TextDecoder().decode(new Uint8Array(data));

        }

        if (typeof data === "string") {

            return data;

        }

        return null;

    }

}