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

        if (!user.IsSuccess)
            return Result.Fail(user.Errors.Select(msg => new Error(msg.ToString()))); // Check how it works

        return user.Value.ToDto();
    }

    public async Task<Result<UserDto>> EditUserById(Guid userId, UserEditProfileModel model)
    {
        var userResult = await _userRepository.GetUserById(userId);

        if (!userResult.IsSuccess)
            return CustomErrors.NotFound("User not found");

        var newUser = model.ToUser(userResult.Value);
        await _userRepository.EditUser(userId, newUser);
        return Result.Ok(newUser.ToDto());
    }



}