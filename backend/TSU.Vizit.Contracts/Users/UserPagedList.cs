using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Contracts.Users;

public class UserPagedList
{
    public List<User> Users { get; set; } = [];
    public int TotalCount { get; set; }
}
