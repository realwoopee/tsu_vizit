using FluentResults;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;

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
}