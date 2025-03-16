using FluentResults;
using FluentResults.Extensions;
using Microsoft.AspNetCore.Mvc;
using TSU.Vizit.Application.Features.AbsenceRequests.Dto;
using TSU.Vizit.Application.Features.Users;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.CsvExport;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.CsvExport;

public class CsvExportService(ICsvExportRepository _csvExportRepository, UserService _userService)
{
    public async Task<Result<List<AbsenceRequestDto>>> ExportAbsenceRequests(Guid curUserId, ExportAllAbsenceRequestsModel model)
    {
        var userPermissions = await _userService.GetUserPermissions(curUserId);
        if (userPermissions.IsFailed)
            return Result.Fail(userPermissions.Errors);
        
        if (!userPermissions.Value.CanExportAll)
            return CustomErrors.Forbidden("You do not have permission to export all absence requests.");
        
        var filter = new ExportAllAbsenceRequestListFilter
        {
            CreatedById = model.CreatedById,
            FinalisedById = model.FinalisedById,
            FinalStatus = model.FinalStatus,
            Reason = model.Reason
        };
        
        return await _csvExportRepository.ExportAbsenceRequests(filter)
            .Map(list => list.Select(ar => ar.ToDto()).ToList());
    }
    
}
