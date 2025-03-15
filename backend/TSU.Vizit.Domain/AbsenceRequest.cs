namespace TSU.Vizit.Domain;

public class AbsenceRequest
{
    public Guid Id { get; set; }
    public DateTime AbsencePeriodStart { get; set; }
    public DateTime AbsencePeriodFinish { get; set; }
    public DateTime TimeCreated { get; set; }
    public DateTime TimeFinalised { get; set; }
    public Guid CreatedById { get; set; }
    public Guid? FinalisedById { get; set; }
    public AbsenceRequestResult? FinalStatus { get; set; } 
    public AbsenceReason Reason { get; set; }
    public List<Document> Attachments { get; set; } = [];
}

public enum AbsenceRequestResult
{
    Unknown,
    Approved,
    Declined
}

public enum AbsenceReason
{
    Personal,
    Family,
    Sick
}
