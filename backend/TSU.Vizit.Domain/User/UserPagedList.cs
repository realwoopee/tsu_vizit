using TSU.Vizit.Domain.Paginaiton;

namespace TSU.Vizit.Domain;

public class UserPagedList
{
    public List<User> users { get; set; }
    public PaginationModel pagination { get; set; }
    public int totalCount { get; set; }
}