namespace TSU.Vizit.Domain.Users;

public static class UserExtensions
{
    public static UserPermissions Permissions(this User user)
    {
        return new UserPermissions(user);
    }
}

public class UserPermissions
{
    public UserPermissions(User user)
    {
        CanCreate = false;
        CanCheck = false;
        CanApprove = false;
        CanCreate = false;
        
        if (user.Role == Roles.Student)
            CanCreate = true;

        if (user.Role == Roles.Teacher)
        {
            CanCreate = true;
            CanCheck = true;
        }

        if (user.Role == Roles.DeansEmployee)
        {
            CanCreate = true;
            CanCheck = true;
            CanApprove = true;
        }

        if (user.Role == Roles.Admin)
        {
            CanCreate = true;
            CanCheck = true;
            CanApprove = true;
            IsAdmin = true;
        }
    }
    public bool CanCreate { get; set; }
    public bool CanCheck { get; set; }
    public bool CanApprove { get; set; }
    public bool IsAdmin { get; set; }
}
