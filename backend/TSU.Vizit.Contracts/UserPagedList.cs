using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Paginaiton;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Contracts;

public class UserPagedList
{
    public List<User> users { get; set; }
    public PaginationModel pagination { get; set; }
    public int totalCount { get; set; }
}
