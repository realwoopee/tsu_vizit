namespace TSU.Vizit.Domain.Users;

public static class UserExtensions
{
    public static UserPermissions ToPermissions(this UserRole userRole)
    {
        return userRole switch
        {
            UserRole.Student => new UserPermissions
            {
                CanCreate = true
            },
            UserRole.Teacher => new UserPermissions
            {
                CanCheck = true
            },
            UserRole.DeansEmployee => new UserPermissions
            {
                CanCheck = true,
                CanApprove = true
            },
            UserRole.Admin => new UserPermissions
            {
                CanCheck = true,
                CanApprove = true,
                CanCreate = true,
                IsAdmin = true
            },
            _ => throw new ArgumentOutOfRangeException()
        };
    }
}

public class UserPermissions
{
    public bool CanCreate { get; set; } = false;
    public bool CanCheck { get; set; } = false;
    public bool CanApprove { get; set; } = false;
    public bool IsAdmin { get; set; } = false;
}
