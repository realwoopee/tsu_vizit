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
        
        if (user.UserRole == UserRole.Student)
            CanCreate = true;

        if (user.UserRole == UserRole.Teacher)
        {
            CanCreate = true;
            CanCheck = true;
        }

        if (user.UserRole == UserRole.DeansEmployee)
        {
            CanCreate = true;
            CanCheck = true;
            CanApprove = true;
        }

        if (user.UserRole == UserRole.Admin)
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
