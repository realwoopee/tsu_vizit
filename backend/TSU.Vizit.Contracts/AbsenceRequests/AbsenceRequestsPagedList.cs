using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts.AbsenceRequests;

public class AbsenceRequestsPagedList
{
    public List<AbsenceRequest> AbsenceRequests { get; set; } = [];
    public int TotalCount { get; set; }
}
