using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;

namespace TSU.Vizit.Application.Features.Sessions;

[Route("api/session")]
[Authorize]
public class SessionsController(ISessionRepository sessionRepository, UserAccessor userAccessor) : ControllerBase
{
    [HttpGet]
    public ActionResult<List<SessionDto>> GetSessions()
    {
        return userAccessor.GetUserId()
            .Map(userId => sessionRepository.GetSessions(userId).Select(s => s.ToDto()).ToList())
            .ToActionResult();
    }

    [HttpGet("current")]
    public ActionResult<List<SessionDto>> GetCurrentSession()
    {
        return userAccessor.GetSessionId()
            .Bind(sessionId => sessionRepository.GetSession(sessionId).Map(s => s.ToDto()))
            .ToActionResult();
    }

    [HttpDelete("{id}")]
    public ActionResult EndSession(Guid id)
    {
        return userAccessor.GetUserId()
            .Bind(userId => sessionRepository.DeleteSession(id, userId))
            .ToActionResult();
    }
}