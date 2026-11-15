import axios from "axios";

const api = axios.create({

    baseURL: "https://api.signalforgepro.app",

    headers: {
        "Content-Type": "application/json"
    }

});

export default api;