using FluentResults;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Dto;

public static class UserDtoConverters
{

    public static User ToUser(this UserEditProfileModel model)
    {
        throw new NotImplementedException();
        return new User
        {
            FullName = model.FullName,
            Email = model.Email,
            // Password = model.Password,
            // StudentIdNumber = model.StudentIdNumber
        };
    }
    public static User ToUser(this UserRegisterModel model)
    {
        return new User
        {
            FullName = model.FullName,
            Email = model.Email,
            Password = model.Password,
            StudentIdNumber = model.StudentIdNumber
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