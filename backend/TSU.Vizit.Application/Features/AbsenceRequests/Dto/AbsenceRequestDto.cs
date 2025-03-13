using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public class AbsenceRequestDto
{
    public Guid Id { get; set; }
    public DateTime TimeCreated { get; set; }
    public DateTime TimeFinalised { get; set; }
    public Guid CreatedById { get; set; }
    public Guid? FinalisedById { get; set; }
    public AbsenceRequestResult? FinalStatus { get; set; } 
    public AbsenceReason Reason { get; set; }
    public List<Document> Attachments { get; set; } = [];
}
