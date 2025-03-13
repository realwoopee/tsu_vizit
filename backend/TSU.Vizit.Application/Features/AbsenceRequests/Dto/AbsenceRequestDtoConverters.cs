using FluentResults;
using FluentResults.Extensions;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public class AbsenceRequestDtoConverters(IAbsenceRequestRepository _absenceRequestRepository, IDocumentRepository _documentRepository)
{

    public AbsenceRequest CreateDtoToRequest(CreateAbsenceRequestModel dto, Guid CreatedById)
    {
        return new AbsenceRequest
        {
            AbsencePeriodStart = dto.AbsencePeriodStart,
            AbsencePeriodFinish = dto.AbsencePeriodFinish,
            TimeCreated = DateTime.Now,
            CreatedById = CreatedById,
            FinalStatus = AbsenceRequestResult.Unknown,
            Reason = dto.Reason
        };
    }
    public async Task<AbsenceRequestDto> RequestToDto(AbsenceRequest model)
    {
        var result = new AbsenceRequestDto
        {
            Id = model.Id,
            AbsencePeriodStart = model.AbsencePeriodStart,
            AbsencePeriodFinish = model.AbsencePeriodFinish,
            FinalisedById = model.FinalisedById,
            CreatedById = model.CreatedById,
            FinalStatus = model.FinalStatus,
            Reason = model.Reason,
            TimeCreated = model.TimeCreated,
            TimeFinalised = model.TimeFinalised
        };
        var attachmentsResult = await _documentRepository.GetAllAttachments(model.Id);
        var attachments = attachmentsResult.Value;
        result.Attachments = attachments;
        return result;
    }

    public async Task<Result<AbsenceRequestPagedListDto>> AbsenceRequestPagedListToDto(AbsenceRequestPagedList model)
    {
        var result = new AbsenceRequestPagedListDto();
        result.TotalCount = model.TotalCount;
        var requestsConverted = new List<AbsenceRequestDto>();
        foreach (var absRequest in model.AbsenceRequests)
        {
            var dto = await RequestToDto(absRequest);
            requestsConverted.Add(dto);
        }

        result.AbsenceRequests = requestsConverted;
        return Result.Ok(result);
    }
}
