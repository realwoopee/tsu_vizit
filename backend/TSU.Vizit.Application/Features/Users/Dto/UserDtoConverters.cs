using TSU.Vizit.Application.Features.Auth.Dto;
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

    public static UserDto ToDto(this User model)
    {
        return new UserDto
        {
            Id = model.Id,
            FullName = model.FullName,
            Email = model.Email,
            StudentCardId = model.StudentIdNumber
        };
    }
}