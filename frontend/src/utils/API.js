
// const API = "http://localhost:8000/api"
// const API = "http://192.168.1.54:8000/api"
const API = "https://createit-zr78.onrender.com/api"

export const AUTH = {
    SIGNUP: `${API}/auth/signup`,
    LOGIN: { API } + "/auth/login"
}

export default API;
