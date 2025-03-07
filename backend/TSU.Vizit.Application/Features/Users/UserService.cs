using System.Security.Claims;
using FluentResults;
using Microsoft.AspNetCore.Identity;
using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Users;

public class UserService(IUserRepository _userRepository)
{
    public async Task<Result<UserDto>> GetUserById(Guid userId)
    {
        var userResult = await _userRepository.GetUserById(userId);

        if (userResult.IsFailed)
            return Result.Fail(userResult.Errors); // Check how it works

        return userResult.Value.ToDto();
    }

    public async Task<Result<UserDto>> EditUserById(Guid userId, UserEditProfileModel model)
    {
        var userResult = await _userRepository.GetUserById(userId);

        if (userResult.IsFailed)
            return Result.Fail(userResult.Errors);

        var newUser = model.ToUser(userResult.Value);
        await _userRepository.EditUser(userId, newUser);
        return Result.Ok(newUser.ToDto());
    }
}