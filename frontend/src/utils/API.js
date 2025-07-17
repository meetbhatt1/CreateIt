// src/api.js
import axios from "axios";

const API = axios.create({
    baseURL: "https://createit-zr78.onrender.com/api",
    headers: {
        "Content-Type": "application/json"
    },
});

export default API;
