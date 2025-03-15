using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.AbsenceRequests.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.AbsenceRequests;


[Authorize]
[ApiController]
[Route("api/absence_request")]
public class AbsenceRequestController: ControllerBase
{
    
    private readonly AbsenceRequestService _absenceRequestService;
    private readonly UserAccessor _userAccessor;

    public AbsenceRequestController(AbsenceRequestService absenceRequestService, UserAccessor userAccessor)
    {
        _absenceRequestService = absenceRequestService;
        _userAccessor = userAccessor;
    }

    [HttpGet("absence_requests")]
    public async Task<ActionResult<List<AbsenceRequestDto>>> GetAllAbsenceRequests([FromQuery] GetAllAbsenceRequestsModel model)
    {
        return await _absenceRequestService.GetAllAbsenceRequests(model).ToActionResult();
    }
    
    [HttpPost("absence_request")]
    public async Task<ActionResult<List<AbsenceRequestDto>>> CreateAbsenceRequest([FromBody] CreateAbsenceRequestModel model)
    {
        var curUserIdResult = _userAccessor.GetUserId();
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<AbsenceRequestDto>> (userId) =>
                await _absenceRequestService.CreateAbsenceRequest(model, userId))
            .ToActionResult();
    }
}
