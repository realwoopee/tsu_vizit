using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Contracts;
using TSU.Vizit.Contracts.Users;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Application.Features.Users.Dto;

public static class UserDtoConverters
{
    public static User ToUser(this UserRegisterModel model)
    {
        return new User
        {
            FullName = model.FullName,
            Email = model.Email,
            StudentIdNumber = model.StudentIdNumber,
        };
    }

    public static UserDto ToDto(this User user)
    {
        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            StudentCardId = user.StudentIdNumber,
            Role = user.UserRole
        };
    }

    public static UserRolesDto ToDto(this UserPermissions userPermissions)
    {
        return new UserRolesDto(userPermissions);
    }

    public static UserRolesDto ToRoles(this User model)
    {
        return new UserRolesDto(model);
    }

    public static UserPagedListDto ToDto(this UserPagedList userPagedList)
    {
        return new UserPagedListDto
        {
            Users = userPagedList.Users.Select(u => u.ToDto()).ToList(),
            TotalCount = userPagedList.TotalCount
        };
    }
}
