using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Contracts.AbsenceRequests;

public class AbsenceRequestListFilter
{
    public Guid UserId { get; set; }
    public User? CreatedBy { get; set; }
    public User? FinalisedBy { get; set; }
    public AbsenceRequestResult? FinalStatus { get; set; } 
    public AbsenceReason Reason { get; set; }
}
