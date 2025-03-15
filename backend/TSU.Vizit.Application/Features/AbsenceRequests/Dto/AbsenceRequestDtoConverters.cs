using FluentResults;
using FluentResults.Extensions;
using TSU.Vizit.Application.Features.Documents.Dto;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public static class AbsenceRequestDtoConverters
{

    public static AbsenceRequest ToEntity(this CreateAbsenceRequestModel dto, Guid CreatedById)
    {
        return new AbsenceRequest
        {
            AbsencePeriodStart = dto.AbsencePeriodStart,
            AbsencePeriodFinish = dto.AbsencePeriodFinish,
            TimeCreated = DateTime.UtcNow,
            CreatedById = CreatedById,
            FinalStatus = AbsenceRequestResult.Unknown,
            Reason = dto.Reason
        };
    }
    public static AbsenceRequestDto ToDto(this AbsenceRequest model)
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
        result.Attachments = model.Attachments.Select(d => d.ToDto()).ToList();
        return result;
    }

    public static AbsenceRequestPagedListDto ToDto(this AbsenceRequestPagedList model)
    {
        return new AbsenceRequestPagedListDto()
        {
            AbsenceRequests = model.AbsenceRequests.Select(ar => ar.ToDto()).ToList(),
            TotalCount = model.TotalCount
        };
    }
}
