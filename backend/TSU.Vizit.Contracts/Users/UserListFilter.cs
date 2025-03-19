using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Contracts.Users;

public class UserListFilter
{
    // public bool MustChangePassword { get; set; }
    public string? StudentIdNumber { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public UserRole? Role { get; set; }
}
