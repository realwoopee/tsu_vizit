namespace TSU.Vizit.Domain;

public class AbsenceRequest
{
    public Guid Id { get; set; }
    public DateTime TimeCreated { get; set; }
    public DateTime TimeFinalised { get; set; }
    public User CreatedBy { get; set; }
    public User? FinalisedBy { get; set; }
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
