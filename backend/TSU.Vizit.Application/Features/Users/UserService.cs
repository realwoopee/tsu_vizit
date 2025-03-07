using System.Security.Claims;
using FluentResults;
using Microsoft.AspNetCore.Identity;
using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Users;

public class UserService(IUserRepository _userRepository) // Is this IPasswordHasher<User> thing correct?
{
    public async Task<Result<UserDto>> GetUserById(Guid userId)
    {
        var user = await _userRepository.GetUserById(userId);

        if (user == null)
            return Result.Fail(new NotFoundError("User not found"));

        return user.ToDto();
    }

    public async Task<Result<UserDto>> EditUserById(Guid userId, UserEditProfileModel model)
    {
        var user = await _userRepository.GetUserById(userId);

        if (user == null)
            return CustomErrors.NotFound("User not found");

        user = model.ToUser(user);
        await _userRepository.EditUser(user.Id, user);
        return Result.Ok(user.ToDto());
    }



}