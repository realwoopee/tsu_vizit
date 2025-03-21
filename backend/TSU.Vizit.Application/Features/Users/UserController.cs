﻿using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Users;

[ApiController]
[Authorize]
[Route("api/account")]
public class UserController(UserAccessor _userAccessor, UserService _userService) : ControllerBase
{
    [HttpGet("permissions")]
    public async Task<ActionResult<UserPermissionsDto>> GetPermissions()
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserPermissionsDto>> (userId) => await _userService.GetUserPermissions(userId))
            .ToActionResult();
    }

    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserDto>> (userId) => await _userService.GetUserById(userId))
            .ToActionResult();
    }

    [HttpPut("profile")]
    public async Task<ActionResult<UserDto>> EditProfile([FromBody] UserEditProfileModel model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserDto>> (userId) => await _userService.EditUserById(userId, model))
            .ToActionResult();
    }

    [HttpPut("{id}/profile")]
    public async Task<ActionResult<UserDto>> EditProfile(Guid id, [FromBody] UserEditProfileModel model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserPermissionsDto>> (userId) => await _userService.GetUserPermissions(userId))
            .Bind((userRoles) => Result.OkIf(userRoles.IsAdmin, new ForbiddenError("You are not an admin.")))
            .Bind(async () => await _userService.GetUserPermissions(id))
            .Bind((userRoles) => Result.FailIf(userRoles.IsAdmin, new ForbiddenError("You can not edit admin user.")))
            .Bind(async Task<Result<UserDto>> () => await _userService.EditUserById(id, model))
            .ToActionResult();
    }

    [HttpPut("{id}/profile/role")]
    public async Task<ActionResult<UserPermissionsDto>> EditUserRole(Guid id, UserRole userRole)
    {
        var userIdResult = _userAccessor.GetUserId();

        return await userIdResult
            .Bind(async Task<Result<UserPermissionsDto>> (userId) => await _userService.GetUserPermissions(userId))
            .Bind((userRoles) => Result.OkIf(userRoles.IsAdmin, new ForbiddenError("You are not an admin.")))
            .Bind(() => Task.FromResult(Result.FailIf(userIdResult.Value == id,
                new ValidationError("Cannot edit your own role"))))
            .Bind(async () => await _userService.EditUserRole(new UserEditRoleModel { Id = id, UserRole = userRole }))
            .ToActionResult();
    }

    [HttpGet("profiles")]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers([FromQuery] GetAllUsersModel model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserPermissionsDto>> (userId) => await _userService.GetUserPermissions(userId))
            .Bind((userRoles) => Result.OkIf(userRoles.IsAdmin, new ForbiddenError("You are not an admin.")))
            .Bind(async () => await _userService.GetAllUsers(model))
            .ToActionResult();
    }
}
