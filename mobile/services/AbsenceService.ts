import { AxiosResponse } from "axios";
import $api from "../http";
import { AuthResponse } from "../models/response/AuthResponse";
import {IUser} from "../models/IUser";
import { SessionResponse } from "../models/response/SessionResponse";
import { IAbsence } from "../models/IAbsence";
import { AbsenceResponse } from "../models/response/AbsenceResponse";

export default class AbsenceService{

    static async getAbsences (
        CreatedById?: string, 
        FinalisedById?: string, 
        FinalStatus?: string, 
        Reason?: string, 
        Sorting?: string, 
        Offset?: number, 
        Limit?: number
    ): Promise<AxiosResponse<AbsenceResponse>>{
        const params = {
            CreatedById,
            FinalisedById,
            FinalStatus,
            Reason,
            Sorting,
            "Pagination.Offset": Offset,
            "Pagination.Limit": Limit,
        };
    
        return $api.get('/absence', {params});
    }

    static async editAbsencePeriodFinish (
        absenceId: string,
        absencePeriodStart: string,
        absencePeriodFinish: string,
        reason: string
    ): Promise<AxiosResponse<IAbsence>>{
    
        return $api.put(`/absence/${absenceId}`, {absencePeriodStart, absencePeriodFinish, reason});
    }

}

