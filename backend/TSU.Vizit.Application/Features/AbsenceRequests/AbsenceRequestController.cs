using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Infrastructure;
using TSU.Vizit.Application.Features.AbsenceRequests.Dto;
using TSU.Vizit.Application.Features.Users;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Domain.Users;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.AbsenceRequests;

[Authorize]
[ApiController]
[Route("api/absence")]
public class AbsenceRequestController(
    AbsenceRequestService _absenceRequestService,
    UserAccessor _userAccessor,
    UserService _userService) : ControllerBase
{

    [HttpGet("{id}")]

    public async Task<ActionResult<AbsenceRequestDto>> GetAbsenceRequest(Guid id)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<AbsenceRequestDto>> (curUserId) =>
                await _absenceRequestService.GetAbsenceRequest(id, curUserId))
            .ToActionResult();
    }
    
    [HttpGet]
    public async Task<ActionResult<List<AbsenceRequestDto>>> GetAllAbsenceRequests(
        [FromQuery] GetAllAbsenceRequestsModel model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async  Task<Result<AbsenceRequestPagedListDto>>  (curUserId) =>
                await _absenceRequestService.GetAllAbsenceRequests(model, curUserId)).ToActionResult();
    }

    [HttpPost]
    public async Task<ActionResult<AbsenceRequestDto>> CreateAbsenceRequest([FromBody] CreateAbsenceRequestModel model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<AbsenceRequestDto>> (userId) =>
                await _absenceRequestService.CreateAbsenceRequest(model, userId))
            .ToActionResult();
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<AbsenceRequestDto>> EditAbsenceRequest([FromBody] EditAbsenceRequestModel model,
        Guid id)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<AbsenceRequestDto>> (userId) =>
                await _absenceRequestService.EditAbsenceRequest(id, model, userId))
            .ToActionResult();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<AbsenceRequestDto>> DeleteAbsenceRequestById(Guid id)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result> (userId) => await _absenceRequestService.DeleteAbsenceRequestById(id, userId))
            .ToActionResult();
    }

    [HttpPut("{id}/status")]
    public async Task<ActionResult<AbsenceRequestDto>> EditAbsenceRequestStatus(Guid id,
        EditAbsenceRequestStatusDto model)
    {
        return await _userAccessor.GetUserId()
            .Bind(async Task<Result<AbsenceRequestDto>> (userId) =>
                await _absenceRequestService.EditAbsenceRequestStatus(id, model, userId))
            .ToActionResult();
    }
}
