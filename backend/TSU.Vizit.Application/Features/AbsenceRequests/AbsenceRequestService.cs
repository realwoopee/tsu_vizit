using FluentResults;
using FluentResults.Extensions;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using TSU.Vizit.Application.Features.AbsenceRequests.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Documents;

namespace TSU.Vizit.Application.Features.AbsenceRequests;

public class AbsenceRequestService(IAbsenceRequestRepository _absenceRequestRepository, IDocumentRepository _documentRepository)
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

        var dtoConverters = new AbsenceRequestDtoConverters(_absenceRequestRepository, _documentRepository);

        var temp = await _absenceRequestRepository.GetAllAbsenceRequests(filter, model.Sorting, model.Pagination);
        var result = await dtoConverters.AbsenceRequestPagedListToDto(temp.Value);
        return result;
    }
    
    public async Task<Result<AbsenceRequestDto>> CreateAbsenceRequest(CreateAbsenceRequestModel model, Guid curUserId)
    {
        var dtoConverters = new AbsenceRequestDtoConverters(_absenceRequestRepository, _documentRepository);
        var createdRequestResult = await _absenceRequestRepository.CreateAbsenceRequest(dtoConverters.CreateDtoToRequest(model, curUserId));
        var dto = await dtoConverters.RequestToDto(createdRequestResult.Value);
        return dto;
    }
}
