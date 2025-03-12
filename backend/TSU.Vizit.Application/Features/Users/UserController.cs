using FluentResults;
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
public class UserController : ControllerBase
{
    private readonly UserAccessor _userAccessor;
    private readonly UserService _userService;

    public UserController(UserService userService, UserAccessor userAccessor)
    {
        _userService = userService;
        _userAccessor = userAccessor;
    }
    
    [HttpGet("permissions")]
    public async Task<ActionResult<UserRolesDto>> GetPermissions()
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserRolesDto>> (userId) => await _userService.GetUserRoles(userId))
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
            .Bind(async Task<Result<UserRolesDto>> (userId) => await _userService.GetUserRoles(userId))
            .Bind((userRoles) => Result.OkIf(userRoles.IsAdmin, new ForbiddenError("You are not an admin.")))
            .Bind(async () => await _userService.GetUserRoles(id))
            .Bind((userRoles) => Result.FailIf(userRoles.IsAdmin, new ForbiddenError("You can not edit admin user.")))
            .Bind(async Task<Result<UserDto>> () => await _userService.EditUserById(id, model))
            .ToActionResult();
    }
    
    [HttpPut("{id}/profile/role")]
    public async Task<ActionResult<UserRolesDto>> EditUserRole(Guid id, UserRole userRole)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<UserRolesDto>> (userId) => await _userService.GetUserRoles(userId))
            .Bind((userRoles) => Result.OkIf(userRoles.IsAdmin, new ForbiddenError("You are not an admin.")))
            .Bind(async () => await _userService.EditUserRole(new UserEditRoleModel{ Id = id, UserRole = userRole }))
            .ToActionResult();
    }
    
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
