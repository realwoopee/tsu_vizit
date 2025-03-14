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
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, `${refreshToken}`, {
                withCredentials:true, 
                headers: {
                'Content-Type': 'application/json' 
                
            },})
            AsyncStorage.setItem('token', response.data.token);
            AsyncStorage.setItem('refreshToken', response.data.refreshToken);
            return $api.request(originalRequest);
        }
        catch(e)
        {
            console.log("unauthorized")
        }
    }
    throw error;
}))


$api.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export default $api;