export interface IAbsence{
    id : string,
    absencePeriodStart: string,
    absencePeriodFinish: string,
    timeCreated: string,
    timeFinalised: string,
    createdById: string,
    finalisedById: string | null,
    finalStatus: string,
    reason: string,
    attachments: any[]
}