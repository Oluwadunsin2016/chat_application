import axios from "axios";

// export const host = 'http://localhost:2500/api';
// export const host = 'https://let-us-discuss-server.vercel.app/api';
export const host = 'https://let-us-discuss-server.onrender.com/api';
const http = axios.create({
    baseURL:host
})

http.interceptors.request.use((config)=>{
    const { intercept=true } = config;
    if(!intercept) return config;
    const token = localStorage.getItem("chatToken")
    if (token) config.headers.Authorization=`Bearer ${token}`;
    return config;
})

export default http