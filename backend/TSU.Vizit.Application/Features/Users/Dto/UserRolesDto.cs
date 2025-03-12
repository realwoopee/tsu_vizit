using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserRolesDto
{
    public UserRolesDto(UserPermissions userPermissions)
    {
        CanCreate = userPermissions.CanCreate;
        CanCheck = userPermissions.CanCheck; 
        CanApprove = userPermissions.CanApprove;
        IsAdmin = userPermissions.IsAdmin;
    }

    public UserRolesDto(User user)
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
