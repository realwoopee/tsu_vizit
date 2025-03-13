import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthResponse } from "../models/response/AuthResponse";


export const API_URL = "https://vizit.90.188.95.63.sslip.io/api"

const $api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    }
})

$api.interceptors.response.use((config)=>{
    return config;
}, (async error => {
    const originalRequest = error.config;
    if (error.response.status == 401 && error.config && !error.config._isRetry){
        originalRequest._isRetry = true;
        try{
            const response = await axios.get<AuthResponse>(`${API_URL}/auth/refresh`, {withCredentials:true})
            AsyncStorage.setItem('token', response.data.token);
            return $api.request(originalRequest);
        }
        catch(e)
        {
            console.log("unauthorized")
        }
    }
    throw error;
}))

$api.interceptors.request.use((config)=>{
    config.headers.Authorization = `Bearer ${AsyncStorage.getItem('token')}`
    return config;
})

export default $api;