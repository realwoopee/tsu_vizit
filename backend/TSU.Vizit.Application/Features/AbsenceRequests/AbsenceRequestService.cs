using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using TSU.Vizit.Application.Features.AbsenceRequests.Dto;
using TSU.Vizit.Application.Features.Users;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.AbsenceRequests;

public class AbsenceRequestService(
    IAbsenceRequestRepository _absenceRequestRepository,
    IDocumentRepository _documentRepository,
    UserService _userService)
{
    public async Task<Result<AbsenceRequestPagedListDto>> GetAllAbsenceRequests(GetAllAbsenceRequestsModel model)
    {
        var filter = new AbsenceRequestListFilter
        {
            CreatedById = model.CreatedById,
            FinalisedById = model.FinalisedById,
            FinalStatus = model.FinalStatus,
            Reason = model.Reason
        };

        return await _absenceRequestRepository.GetAllAbsenceRequests(filter, model.Sorting, model.Pagination)
            .Bind(Result<AbsenceRequestPagedListDto> (x) => x.ToDto());
    }

    public async Task<Result<AbsenceRequestDto>> CreateAbsenceRequest(CreateAbsenceRequestModel model, Guid curUserId)
    {
        return await _absenceRequestRepository.CreateAbsenceRequest(model.ToEntity(curUserId))
            .Bind(Result<AbsenceRequestDto> (data) => data.ToDto());
    }

    public async Task<Result> DeleteAbsenceRequestById(Guid absenceRequestId, Guid curUserId)
    {
        var absenceRequest = await _absenceRequestRepository.GetAbsenceRequestById(absenceRequestId);
        if (absenceRequest.IsFailed)
            return Result.Fail(absenceRequest.Errors);

        var userPermissions = await _userService.GetUserPermissions(curUserId);
        if (userPermissions.IsFailed)
            return Result.Fail(userPermissions.Errors);

        return await Result
            .FailIf(absenceRequest.Value.CreatedById != curUserId && !userPermissions.Value.IsAdmin,
                new ForbiddenError("User does not have permission to delete this absence request."))
            .Bind(async Task<Result> () =>
                await _absenceRequestRepository.DeleteAbsenceRequest(absenceRequestId));
    }

    public async Task<Result<AbsenceRequestDto>> EditAbsenceRequest(Guid id, EditAbsenceRequestModel model,
        Guid curUserId)
    {
        var absenceRequestResult = await _absenceRequestRepository.GetAbsenceRequestById(id);
        if (absenceRequestResult.IsFailed)
            return Result.Fail(absenceRequestResult.Errors);

        var userPermissions = await _userService.GetUserPermissions(curUserId);
        if (userPermissions.IsFailed)
            return Result.Fail(userPermissions.Errors);

        if (absenceRequestResult.Value.CreatedById != curUserId && !userPermissions.Value.IsAdmin)
            return CustomErrors.Forbidden("User does not have permission to edit this absence request.");

        var absenceRequest = absenceRequestResult.Value;
        absenceRequest.Reason = model.Reason;
        absenceRequest.AbsencePeriodStart = model.AbsencePeriodStart;
        absenceRequest.AbsencePeriodFinish = model.AbsencePeriodFinish;

        return await _absenceRequestRepository.EditAbsenceRequest(absenceRequest)
            .Map(ar => ar.ToDto());
    }

    public async Task<Result<AbsenceRequestDto>> EditAbsenceRequestStatus(Guid absenceRequestId,
        EditAbsenceRequestStatusDto dto, Guid curUserId)
    {
        var absenceRequestResult = await _absenceRequestRepository.GetAbsenceRequestById(absenceRequestId);
        if (absenceRequestResult.IsFailed)
            return Result.Fail(absenceRequestResult.Errors);

        var userPermissions = await _userService.GetUserPermissions(curUserId);
        if (userPermissions.IsFailed)
            return Result.Fail(userPermissions.Errors);

        if (!(userPermissions.Value.IsAdmin || userPermissions.Value.CanApprove))
            return CustomErrors.Forbidden("User does not have permission to edit the result of this absence request.");

        var absenceRequest = absenceRequestResult.Value;
        absenceRequest.FinalStatus = dto.status;

        return await _absenceRequestRepository.EditAbsenceRequest(absenceRequest)
            .Map(ar => ar.ToDto());
    }
}
