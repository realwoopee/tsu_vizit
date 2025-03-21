﻿using System.Security.Claims;
using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Identity;
using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Contracts;
using TSU.Vizit.Contracts.Users;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;
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
                user.Email = model.Email;
                return await userRepository.EditUser(userId, user);
            }).Map(u => u.ToDto());
    }

    public async Task<Result<UserPermissionsDto>> GetUserPermissions(Guid userId)
    {
        return await userRepository.GetUserById(userId).Map(u => u.UserRole.ToPermissions().ToDto());
    }

    public async Task<Result<UserPagedListDto>> GetAllUsers(GetAllUsersModel model)
    {
        var filter = new UserListFilter
        {
            Email = model.Email,
            FullName = model.FullName,
            Role = model.Role,
            StudentIdNumber = model.StudentIdNumber
        };


        return await userRepository.GetAllUsers(filter, model.Sorting, model.Pagination)
            .Map(u => u.ToDto());
    }

    public async Task<Result<UserPermissionsDto>> EditUserRole(UserEditRoleModel model)
    {
        return await userRepository.EditUserRole(model.Id, model.UserRole).Map(u => u.UserRole.ToPermissions().ToDto());
    }
}
