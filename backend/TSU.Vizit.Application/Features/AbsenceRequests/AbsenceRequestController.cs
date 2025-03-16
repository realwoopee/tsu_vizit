using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.AbsenceRequests.Dto;
using TSU.Vizit.Application.Features.Users;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Domain.Users;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.AbsenceRequests;


[Authorize]
[ApiController]
[Route("api/")]
public class AbsenceRequestController(AbsenceRequestService _absenceRequestService, UserAccessor _userAccessor, UserService _userService): ControllerBase
{
    
    [HttpGet("absence_requests")]
    public async Task<ActionResult<List<AbsenceRequestDto>>> GetAllAbsenceRequests([FromQuery] GetAllAbsenceRequestsModel model)
    {
        return await _absenceRequestService.GetAllAbsenceRequests(model).ToActionResult();
    }
    
    [HttpPost("absence_request")]
    public async Task<ActionResult<AbsenceRequestDto>> CreateAbsenceRequest([FromBody] CreateAbsenceRequestModel model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<AbsenceRequestDto>> (userId) =>
                await _absenceRequestService.CreateAbsenceRequest(model, userId))
            .ToActionResult();
    }
    
    [HttpPut("{id}/absence_request")]
    public async Task<ActionResult<AbsenceRequestDto>> EditAbsenceRequest([FromBody] EditAbsenceRequestModel model, Guid id)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<AbsenceRequestDto>> (userId) =>
                await _absenceRequestService.EditAbsenceRequest(id, model, userId))
            .ToActionResult();
    }
    
    [HttpDelete("absence_request")]
    public async Task<ActionResult<AbsenceRequestDto>> DeleteAbsenceRequestById (Guid absenceRequestId)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result> (userId) => await _absenceRequestService.DeleteAbsenceRequestById(absenceRequestId, userId))
            .ToActionResult();
    }
    
}
