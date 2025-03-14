import { makeAutoObservable } from "mobx";
import { IUser } from "../models/IUser";
import AuthService from "../services/AuthService";
import axios, { AxiosError } from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse } from "../models/response/AuthResponse";
import { API_URL } from "../http";

export default class Store{
    user = {} as IUser;
    isAuth = false;
    isLoading = false;

    constructor(){
        makeAutoObservable(this);
    }

    setAuth(bool: boolean){
        this.isAuth = bool;
    }

    setUser(user: IUser){
        this.user = user;
    }

    setLoading(bool: boolean){
        this.isLoading = bool;
    }

    handleApiError(e: unknown) {
        if (axios.isAxiosError(e)) {
            const data = e.response?.data;
            const errorStatus = data?.status || null;
            console.log(e.response?.data);
            throw { status: errorStatus };
        } else {
            console.log("unexpected error:", e);
            throw { status: null };
        }
    }

    async login (email: string, password: string) {
        try{
           const response = await AuthService.login(email, password); 
           console.log(response);
           AsyncStorage.setItem('token', response.data.token);
           AsyncStorage.setItem('refreshToken', response.data.refreshToken);
           this.setAuth(true);
        }
        catch(e)
        {   
            this.handleApiError(e);
        }
    }

    async register (email: string, password: string, name: string, lastName: string) {
        try{
           const response = await AuthService.register(email, password, lastName+" "+name, "111111"); 
           console.log(response);
           AsyncStorage.setItem('token', response.data.token);
           AsyncStorage.setItem('refreshToken', response.data.refreshToken);
           this.setAuth(true);
        }
        catch(e)
        {   
            this.handleApiError(e);
        }
    }

    async logout () {
        try{
           const curSession = await AuthService.getCurSession(); 
           const response = await AuthService.logout(curSession?.data?.id)
           AsyncStorage.removeItem('token');
           AsyncStorage.removeItem('refreshToken');
           this.setAuth(false);
           this.setUser({} as IUser)
        }
        catch(e)
        {   
            this.handleApiError(e);
        }
    }

    async getProfile () {
        try{
           const response = await AuthService.getProfile(); 
           this.setUser(response.data as IUser);
        }
        catch(e)
        {   
            this.handleApiError(e);
        }
    }

    async editProfile (fullName: string, email: string) {
        try{
           const response = await AuthService.editProfile(fullName, email); 
           this.setUser(response.data as IUser);
        }
        catch(e)
        {   
            this.handleApiError(e);
        }
    }

    async checkAuth(){
        this.setLoading(true);
        try{
            const refreshToken = await AsyncStorage.getItem('refreshToken');
            const response = await axios.post<AuthResponse>(`${API_URL}/auth/refresh`, `${refreshToken}`, {
                withCredentials:true, 
                headers: {
                'Content-Type': 'application/json' 
                
            },})
            console.log(response);
           AsyncStorage.setItem('token', response.data.token);
           AsyncStorage.setItem('refreshToken', response.data.refreshToken);
           this.setAuth(true);

        }
        catch(e)
        {
            if (axios.isAxiosError(e)) {
                console.log(e.response?.data?.errors);
            } else {
                console.log('unexpected error:', e);
            }

        }
        finally
        {
            this.setLoading(false);
        }
    }
}
