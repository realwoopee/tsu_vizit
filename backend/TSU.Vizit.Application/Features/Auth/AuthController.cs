using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Features.Users.Dto;

namespace TSU.Vizit.Application.Features.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController(AuthService authService, ILogger<AuthController> logger)
{
    [AllowAnonymous]
    [HttpPost("develop/insta_login")]
    public async Task<ActionResult<LoginResultDto>> InstaLogin()
    {
        var userLoginDto = new UserLoginModel
        {
            Email = "user@example.com",
            Password = "string"
// {
//   "fullName": "string",
//   "email": "user@example.com",
//   "password": "string",
//   "studentIdNumber": "string"
// }        
        };
        return await authService.LoginUser(userLoginDto).ToActionResult();
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<ActionResult<LoginResultDto>> Login(UserLoginModel userLoginDto)
    {
        return await authService.LoginUser(userLoginDto).ToActionResult();
    }

    [AllowAnonymous]
    [HttpPost("refresh")]
    public async Task<ActionResult<LoginResultDto>> Refresh([FromBody] string refreshToken)
    {
        return await authService.RefreshUserToken(refreshToken).ToActionResult();
    }

    [AllowAnonymous]
    [HttpPost("change-password")]
    public async Task<ActionResult> GetAllUsers([FromBody] UserChangePasswordModel model)
    {
        return await authService.ChangeUserPassword(model).ToActionResult();
    }
}
