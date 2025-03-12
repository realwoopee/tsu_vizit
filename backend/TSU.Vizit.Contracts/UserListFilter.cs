using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Contracts;

public class UserListFilter
{
    // public bool MustChangePassword { get; set; }
    public string? StudentIdNumber { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public Roles? Role { get; set; }
}
