using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.AbsenceRequests.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.AbsenceRequests;

public class AbsenceRequestController: ControllerBase
{
    
    private readonly AbsenceRequestService _absenceRequestService;
    private readonly UserAccessor _userAccessor;
    
    [HttpGet("absence_requests")]
    public async Task<ActionResult<List<AbsenceRequestDto>>> GetAllAbsenceRequests([FromQuery] GetAllAbsenceRequestsModel model)
    {
        return await _absenceRequestService.GetAllAbsenceRequests(model).ToActionResult();
    }
    
    [HttpPost("absence_request")]
    public async Task<ActionResult<List<AbsenceRequestDto>>> CreateAbsenceRequest([FromQuery] CreateAbsenceRequestModel model)
    {
        var curUserIdResult = _userAccessor.GetUserId();
        return await _absenceRequestService.CreateAbsenceRequest(model, curUserIdResult.Value).ToActionResult();
    }
}
