import axios from "axios";

export const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_URL_LOGS,
    auth: {
        username: process.env.NEXT_PUBLIC_USERNAME_LOG || '',
        password: process.env.NEXT_PUBLIC_PASS_LOG || ''
    }
})