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
        // return await _userAccessor.GetUserId()
        //     .Bind(async () => await _absenceRequestService.GetAllAbsenceRequests(model))
        //     .ToActionResult();
            // .Bind(async Task<Result<UserPermissionsDto>> (userId) => await _absencreRequestService.GetUserRoles(userId))
            // .Bind((userRoles) => Result.OkIf(userRoles.IsAdmin, new ForbiddenError("You are not an admin.")))
    }
}
