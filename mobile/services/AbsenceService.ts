import { AxiosResponse } from "axios";
import $api from "../http";
import { IAbsence } from "../models/IAbsence";
import { AbsenceResponse } from "../models/response/AbsenceResponse";
import { IDocument } from "../models/IDocument";

export default class AbsenceService{

    static async getAbsences (
        CreatedById?: string, 
        FinalisedById?: string, 
        CreatedBy?: string,
        FinalStatus?: string, 
        Reason?: string, 
        Sorting?: string, 
        Offset?: number, 
        Limit?: number
    ): Promise<AxiosResponse<AbsenceResponse>>{
        const params = {
            CreatedById,
            FinalisedById,
            CreatedBy,
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
    
        // const file = await fetch(uri).then(res => res.blob());
        // formData.append('file', file, name);

        formData.append('file', {
            uri: uri,
            name: name,
            type: type,
        } as any);

        return $api.post(`/absence/${id}/attach`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Accept': 'text/plain'
            }
        });
    }

    static async putStatus (id: string, status: string): Promise<AxiosResponse<AbsenceResponse>> {
        return $api.put(`/absence/${id}/status`, {status});
    }

    static async getDocument(id: string): Promise<AxiosResponse<IDocument>>{
        return $api.get(`/document/${id}`);
    }

    static async deleteDocument(id: string): Promise<AxiosResponse<void>>{
        return $api.delete(`/absence/${id}/delete`);
    }
}