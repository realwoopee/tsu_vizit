import React from "react";
import axios from "axios";
import type {Pass} from "../components/pass-list-item"

const baseUrl = 'https://vizit.90.188.95.63.sslip.io/api/';

export interface SearchParams {
    CreatedById?: string;
    FinalisedById?: string;
    CreatedBy?: string;
    FinalStatus?: string;
    Reason?: string;
    Sorting?: string;
    "Pagination.Offset"?: number;
    "Pagination.Limit"?: number;
}



export interface PassesResponse{
    passes: Pass[];
    totalCount: number;
}
const buildQueryString = (params: SearchParams): string => {
    const queryParams = new URLSearchParams()
  
    if (params.CreatedById) {
      queryParams.append("CreatedById", params.CreatedById)
    }
  
    if (params.FinalisedById) {
      queryParams.append("FinalisedById", params.FinalisedById)
    }
  
    if (params.CreatedBy) {
      queryParams.append("CreatedBy", params.CreatedBy)
    }
  
    if (params.FinalStatus) {
      queryParams.append("FinalStatus", params.FinalStatus)
    }
  
    if (params.Reason) {
      queryParams.append("Reason", params.Reason)
    }

    if (params.Sorting !== undefined) {
        queryParams.append("Sorting", params.Sorting)
      }
      
    return queryParams.toString()
  }
  
export const GettingPasses = async (params: SearchParams): Promise<PassesResponse> => {
    try {
        const queryString = buildQueryString(params)
        const response = await axios.get(`${baseUrl}absence${queryString ? `?${queryString}` : ""}?`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            params: {
                "Pagination.Offset": params["Pagination.Offset"],
                "Pagination.Limit": params["Pagination.Limit"]
            }
        });
        
        return {passes: response.data.absenceRequests,
            totalCount: response.data.totalCount,
        }
    } catch (error) {
        console.error("Error fetching passes:", error); 
        throw error;  
    }
};
