using System.Security.Claims;
using FluentResults;
using FluentResults.Extensions;
using Microsoft.AspNetCore.Identity;
using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Users;

public class UserService(IUserRepository userRepository)
{
    public async Task<Result<UserDto>> GetUserById(Guid userId)
    {
        return await userRepository.GetUserById(userId).Map(u => u.ToDto());
    }

    public async Task<Result<UserDto>> EditUserById(Guid userId, UserEditProfileModel model)
    {
        return await userRepository.GetUserById(userId)
            .Bind(async user =>
            {
                user.FullName = model.FullName;
                return await userRepository.EditUser(userId, user);
            }).Map(u => u.ToDto());
    }

    public async Task<Result<UserRolesDto>> GetUserRoles(Guid userId)
    {
        return await userRepository.GetUserById(userId).Map(u => u.ToRoles());
    }
}