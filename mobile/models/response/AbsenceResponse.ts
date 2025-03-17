import { IAbsence } from "../IAbsence";

export interface AbsenceResponse {
    absenceRequests: IAbsence[];
    totalCount: number;
}