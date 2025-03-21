using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public class GetAllAbsenceRequestsModel
{
    public Guid? CreatedById { get; set; }
    public Guid? FinalisedById { get; set; }
    public string? CreatedBy { get; set; }
    public AbsenceRequestResult? FinalStatus { get; set; }
    public AbsenceReason? Reason { get; set; }
    public AbsenceRequestSorting? Sorting { get; set; }
    public PaginationModel? Pagination { get; set; }
}
