import React from "react";
import axios from "axios";

const baseUrl = 'https://vizit.90.188.95.63.sslip.io/api/';

export const GettingPasses = async (params: {
    CreatedById: string;
    FinalisedById: string;
    CreatedBy: string;
    FinalStatus: string;
    Reason: string;
    Sorting: string;
    "Pagination.Offset": number;
    "Pagination.Limit": number;
}) => {
    try {
        const response = await axios.get(`${baseUrl}account/permissions`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json"
            },
            params: {
                ...params,
                "Pagination.Offset": params["Pagination.Offset"],
                "Pagination.Limit": params["Pagination.Limit"]
            }
        });
        return response.data; 
    } catch (error) {
        console.error("Error fetching passes:", error); 
        throw error;  
    }
};
