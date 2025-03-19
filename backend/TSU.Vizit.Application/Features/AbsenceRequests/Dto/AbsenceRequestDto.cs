using TSU.Vizit.Application.Features.Documents.Dto;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public class AbsenceRequestDto
{
    public Guid Id { get; set; }
    public DateOnly AbsencePeriodStart { get; set; }
    public DateOnly AbsencePeriodFinish { get; set; }
    public DateTime TimeCreated { get; set; }
    public DateTime TimeFinalised { get; set; }
    public Guid CreatedById { get; set; }
    public string CreatedBy { get; set; }
    public Guid? FinalisedById { get; set; }
    public AbsenceRequestResult? FinalStatus { get; set; }
    public AbsenceReason Reason { get; set; }
    public List<DocumentDto> Attachments { get; set; } = [];
}
