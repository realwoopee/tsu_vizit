import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import {IUser} from "../models/IUser";

export default class AuthService{
    static async login (email: string, password: string): Promise<AxiosResponse<AuthResponse>>{
        return $api.post('/auth/login', {email, password})
    }

    static async register (email: string, password: string, fullName: string, studentIdNumber: string): Promise<AxiosResponse<AuthResponse>>{
        return $api.post('/register', {fullName, email, password, studentIdNumber})
    }

    static async logout (): Promise<void>{
        return $api.post('/logout')
    }

    static async getProfile (): Promise<AxiosResponse<IUser>>{
        return $api.get<IUser>('/account/profile')
    }
}

