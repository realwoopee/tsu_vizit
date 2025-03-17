import { AxiosResponse } from "axios";
import $api from "../http";
import { IAbsence } from "../models/IAbsence";
import { AbsenceResponse } from "../models/response/AbsenceResponse";
import { IDocument } from "../models/IDocument";

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

    static async postAbsence (
        absencePeriodStart: string,
        absencePeriodFinish: string,
        reason: string
    ): Promise<AxiosResponse<IAbsence>>{

        return $api.post(`/absence`, {absencePeriodStart, absencePeriodFinish, reason})
    }

    static async deleteAbsence (id: string): Promise<AxiosResponse<IAbsence>> {
        return $api.delete(`/absence/${id}`);
    }

    static async postDocument (id: string, uri: string, name: string, type: string): Promise<AxiosResponse<IDocument>> {
        const formData = new FormData();

        formData.append('file', {
            uri: uri,
            name: name,
            type: type,
        } as any);

        return $api.post(`/absence/${id}/attach`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
}