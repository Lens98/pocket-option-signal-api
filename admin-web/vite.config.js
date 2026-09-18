import { defineConfig } from "vite";

export default defineConfig({
    server: {
        host: "localhost",
        port: 5173,
        hmr: {
            host: "localhost",
            port: 5173,
            protocol: "ws",
        },
    },
});