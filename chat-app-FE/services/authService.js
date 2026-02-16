import axios from "axios"
import { API_URL } from "../constants"

export const login = async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/login`, {
            email, password
        })
        return response.data
    } catch (error) {
        const msg = error?.response?.data?.msg || "Login failed"
        throw new Error(msg)
    }
}

export const register = async (email, password, name, avatar) => {
    try {
        const response = await axios.post(`${API_URL}/api/auth/register`, {
            email, password, name, avatar
        })
        return response.data
    } catch (error) {
        const msg = error?.response?.data?.msg || "register failed"
        throw new Error(msg)
    }
}