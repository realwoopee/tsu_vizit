﻿using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Users;

[ApiController]
[Route("api/account")]
public class UserController : ControllerBase
{
    private readonly UserAccessor _userAccessor;
    private readonly UserService _userService;

    public UserController(UserService userService, UserAccessor userAccessor)
    {
        _userService = userService;
        _userAccessor = userAccessor;
    }

    [Authorize]
    [HttpGet("roles")]
    public async Task<ActionResult<UserDto>> GetRoles()
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserRolesDto>> (userId) => await _userService.GetUserRoles(userId))
            .ToActionResult();
    }

    [Authorize]
    [HttpGet("profile")]
    public async Task<ActionResult<UserDto>> GetProfile()
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserDto>> (userId) => await _userService.GetUserById(userId))
            .ToActionResult();
    }


    [Authorize]
    [HttpPut("profile")]
    public async Task<ActionResult<UserDto>> EditProfile([FromBody] UserEditProfileModel model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserDto>> (userId) => await _userService.EditUserById(userId, model))
            .ToActionResult();
    }
    
    [Authorize]
    [HttpPut("{id}/profile")]
    public async Task<ActionResult<UserDto>> EditProfile(Guid id, [FromBody] UserEditProfileModel model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserRolesDto>> (userId) => await _userService.GetUserRoles(userId))
            .Bind((userRoles) => Result.OkIf(userRoles.IsAdmin, new ForbiddenError("You are not an admin.")))
            .Bind(async () => await _userService.GetUserRoles(id))
            .Bind((userRoles) => Result.FailIf(userRoles.IsAdmin, new ForbiddenError("You can not edit admin user.")))
            .Bind(async Task<Result<UserDto>> () => await _userService.EditUserById(id, model))
            .ToActionResult();
    }

    [Authorize]
    [HttpPut("{id}/profile/role")]
    public async Task<ActionResult<UserRolesDto>> EditUserRole(Guid id, Roles role)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserRolesDto>> (userId) => await _userService.GetUserRoles(userId))
            .Bind((userRoles) => Result.OkIf(userRoles.IsAdmin, new ForbiddenError("You are not an admin.")))
            .Bind(async () => await _userService.EditUserRole(new UserEditRoleModel{ Id = id, Role = role }))
            .ToActionResult();
    }
    
    [Authorize]
    [HttpGet("profiles")]
    public async Task<ActionResult<List<UserDto>>> GetAllUsers([FromQuery] GetAllUsersModel model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserRolesDto>> (userId) => await _userService.GetUserRoles(userId))
            .Bind((userRoles) => Result.OkIf(userRoles.IsAdmin, new ForbiddenError("You are not an admin.")))
            .Bind(async () => await _userService.GetAllUsers(model))
            .ToActionResult();
    }
  
}