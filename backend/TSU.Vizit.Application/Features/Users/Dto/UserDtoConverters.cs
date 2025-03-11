using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Utils.Pagination.Dto;
using TSU.Vizit.Domain;

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
            Role = user.Role
        };
    }

    public static UserRolesDto ToRoles(this User model)
    {
        return new UserRolesDto
        {
            CanCreate = model.CanCreate,
            CanApprove = model.CanApprove,
            CanCheck = model.CanCheck,
            IsAdmin = model.IsAdmin
        };
    }

    public static UserPagedListDto ToDto(this UserPagedList userPagedList)
    {
        return new UserPagedListDto
        {
            Users = userPagedList.users.Select(u => u.ToDto()).ToList(),
            Pagination = new PaginationDto
            {
                Size = userPagedList.pagination.Size, Current = userPagedList.pagination.Page,
                Count = (int)Math.Ceiling((double)userPagedList.totalCount / userPagedList.pagination.Size) 
            }
        };
    }
}