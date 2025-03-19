using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts.AbsenceRequests;

public class AbsenceRequestPagedList
{
    public List<AbsenceRequest> AbsenceRequests { get; set; } = [];
    public List<string> AbsenceRequestAuthorNames { get; set; } = [];
    public int TotalCount { get; set; }
}
