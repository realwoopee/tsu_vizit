import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import {IUser} from "../models/IUser";
import { SessionResponse } from "../models/response/SessionResponse";
import { IPermissions } from "../models/IPermissions";

export default class AuthService{
    static async login (email: string, password: string): Promise<AxiosResponse<AuthResponse>>{
        return $api.post('/auth/login', {email, password})
    }

    static async register (email: string, password: string, fullName: string): Promise<AxiosResponse<AuthResponse>>{
        return $api.post('/register', {fullName, email, password})
    }

    static async getCurSession (): Promise<AxiosResponse<SessionResponse>>{
        return $api.get('/session/current')
    }

    static async logout(id: string): Promise<void> {
        return $api.delete(`/session/${id}`);
    }

    static async getProfile (): Promise<AxiosResponse<IUser>>{
        return $api.get<IUser>('/account/profile')
    }

    static async editProfile (fullName: string, email: string): Promise<AxiosResponse<IUser>>{
        return $api.put<IUser>('/account/profile', {fullName, email})
    }

    static async getPermissions (): Promise<AxiosResponse<IPermissions>>{
        return $api.get('/account/permissions')
    }
}

