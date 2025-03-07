using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;

namespace TSU.Vizit.Application.Features;

[Microsoft.AspNetCore.Components.Route("api/session")]
[Authorize]
public class SessionController(SessionService _sessionService, UserAccessor _userAccessor) : ControllerBase
{

    [HttpGet]
    public ActionResult<List<SessionDto>> GetSessions()
    {
        return _userAccessor.GetUserId()
            .Map(userId => _sessionService.GetSessions(userId).Select(s => s.ToDto()).ToList())
            .ToActionResult();
    }

    [HttpGet("current")]
    public ActionResult<List<SessionDto>> GetCurrentSession()
    {
        return _userAccessor.GetSessionId()
            .Bind(sessionId => _sessionService.GetSession(sessionId).Map(s => s.ToDto()))
            .ToActionResult();
    }

    [HttpDelete("{id}")]
    public ActionResult EndSession(Guid id)
    {
        return _userAccessor.GetUserId()
            .Bind(userId => _sessionService.DeleteSession(id, userId))
            .ToActionResult();
    }
}