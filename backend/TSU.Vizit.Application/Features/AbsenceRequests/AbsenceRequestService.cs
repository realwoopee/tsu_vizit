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
using TSU.Vizit.Domain.Users;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.AbsenceRequests;

public class AbsenceRequestService(
    IAbsenceRequestRepository _absenceRequestRepository,
    IDocumentRepository _documentRepository,
    UserService _userService)
{
    
    public async Task<Result<AbsenceRequestDto>> GetAbsenceRequest(Guid id, Guid curUserId)
    {
        var userPermissions = await _userService.GetUserPermissions(curUserId);
        if (userPermissions.IsFailed)
            return Result.Fail(userPermissions.Errors);
        
        var result = await _absenceRequestRepository.GetAbsenceRequestById(id)
            .Bind(Result<AbsenceRequestDto> (ar) => ar.ToDto());

        var requestCreatedBy = await _userService.GetUserById(result.Value.CreatedById);
        
        if (requestCreatedBy.IsFailed)
            return Result.Fail(requestCreatedBy.Errors);
        
        result.Value.CreatedBy = requestCreatedBy.Value.FullName;

        if (result.Value.CreatedById != curUserId && !userPermissions.Value.CanCheck)
            return CustomErrors.Forbidden("User does not have permission to retrieve this absence request.");
        
        return result;
    }
    public async Task<Result<AbsenceRequestPagedListDto>> GetAllAbsenceRequests(GetAllAbsenceRequestsModel model, Guid curUserId)
    {
        var userPermissions = await _userService.GetUserPermissions(curUserId);
        if (userPermissions.IsFailed)
            return Result.Fail(userPermissions.Errors);

        
        var filter = new AbsenceRequestListFilter
        {
            CreatedBy = model.CreatedBy,
            CreatedById = model.CreatedById,
            FinalisedById = model.FinalisedById,
            FinalStatus = model.FinalStatus,
            Reason = model.Reason
        };

        if (!userPermissions.Value.CanViewAlienAbsences)
        {
            filter.CreatedById = curUserId;
        }
        
        
        var absenceRequestPagedList =
            await _absenceRequestRepository.GetAllAbsenceRequests(filter, model.Sorting, model.Pagination);
        
        if (absenceRequestPagedList.IsFailed)
            return Result.Fail(absenceRequestPagedList.Errors);
        
        var absenceRequestPagedListDto = absenceRequestPagedList.Value.ToDto();
        

        for (int i=0; i<absenceRequestPagedListDto.AbsenceRequests.Count; i++)
        {
            absenceRequestPagedListDto.AbsenceRequests[i].CreatedBy = absenceRequestPagedList.Value.AbsenceRequestAuthorNames[i];
        }
        
        return absenceRequestPagedListDto;
    }

    public async Task<Result<AbsenceRequestDto>> CreateAbsenceRequest(CreateAbsenceRequestModel model, Guid curUserId)
    {
        return await _absenceRequestRepository.CreateAbsenceRequest(model.ToEntity(curUserId))
            .Bind(Result<AbsenceRequestDto> (data) => data.ToDto())
            .Bind(async Task<Result<AbsenceRequestDto>> (data) =>
            {
                var user = await _userService.GetUserById(curUserId);
                data.CreatedBy = user.Value.FullName;
                return data;
            });
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
            {
                await _documentRepository.DeleteAttachedDocuments(absenceRequestId);
                return await _absenceRequestRepository.DeleteAbsenceRequest(absenceRequestId);
            });
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
        
        var userCreatedBy = await _userService.GetUserById(absenceRequest.CreatedById);

        return await _absenceRequestRepository.EditAbsenceRequest(absenceRequest)
            .Map(ar => ar.ToDto())
            .Bind(Result<AbsenceRequestDto> (ar) =>
            {
                ar.CreatedBy = userCreatedBy.Value.FullName;
                return ar;
            });
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
