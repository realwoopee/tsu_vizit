using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Dto;

public static class UserDtoConverters
{
    public static User ToUser(this UserRegisterModel model)
    {
        throw new NotImplementedException();
        return new User
        {
            //TODO: Adjust this method for User class.
            
            // FullName = model.FullName,
            // Email = model.Email,
        };
    }

    public static UserDto ToDto(this User model)
    {
        throw new NotImplementedException();
        return new UserDto
        {
            //TODO: Adjust this method for User class.
            
            // Id = model.Id,
            // FullName = model.FullName,
            // BirthDate = model.BirthDate,
            // CreateTime = model.CreateTime,
            // Email = model.Email,
            // Gender = model.Gender,
            // PhoneNumber = model.PhoneNumber
        };
    }
}