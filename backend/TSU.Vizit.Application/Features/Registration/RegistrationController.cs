using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.Auth;
using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Features.Users;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;

namespace TSU.Vizit.Application.Features.Registration;

[ApiController]
[Route("api/register")]
public class RegistrationController(AuthService authService, UserAccessor userAccessor) : ControllerBase
{
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<LoginResultDto>> Register([FromBody] UserRegisterModel model)
    {
        return await authService.RegisterUser(model).ToActionResult();
    }
}
