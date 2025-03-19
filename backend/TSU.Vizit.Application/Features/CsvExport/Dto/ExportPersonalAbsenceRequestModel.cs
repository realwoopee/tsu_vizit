using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public class ExportPersonalAbsenceRequestModel
{
    public Guid? FinalisedById { get; set; }
    public AbsenceRequestResult? FinalStatus { get; set; }
    public AbsenceReason? Reason { get; set; }
}
