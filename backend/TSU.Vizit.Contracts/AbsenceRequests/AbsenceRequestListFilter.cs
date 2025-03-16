using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Contracts.AbsenceRequests;

public class AbsenceRequestListFilter
{
    public Guid? CreatedById { get; set; }
    public Guid? FinalisedById { get; set; }
    public AbsenceRequestResult? FinalStatus { get; set; }
    public AbsenceReason? Reason { get; set; }
}
