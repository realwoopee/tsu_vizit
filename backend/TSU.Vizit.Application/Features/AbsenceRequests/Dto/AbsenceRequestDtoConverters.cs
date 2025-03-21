using FluentResults;
using FluentResults.Extensions;
using FluentResults.Extensions.AspNetCore;
using TSU.Vizit.Application.Features.Documents.Dto;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public static class AbsenceRequestDtoConverters
{
    public static AbsenceRequest ToEntity(this CreateAbsenceRequestModel dto, Guid createdById)
    {
        return new AbsenceRequest
        {
            AbsencePeriodStart = dto.AbsencePeriodStart,
            AbsencePeriodFinish = dto.AbsencePeriodFinish,
            TimeCreated = DateTime.UtcNow,
            CreatedById = createdById,
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
            TimeFinalised = model.TimeFinalised,
            Attachments = model.Attachments.Select(d => d.ToShortDto()).ToList()
        };
        if (model.CreatedBy != null)
            result.CreatedBy = model.CreatedBy.FullName;
        
        return result;
    }

    public static AbsenceRequestPagedListDto ToDto(this AbsenceRequestPagedList model)
    {
        return new AbsenceRequestPagedListDto
        {
            AbsenceRequests = model.AbsenceRequests.Select(ar => ar.ToDto()).ToList(),
            TotalCount = model.TotalCount
        };
    }

    public static AbsenceRequest ToEntity(this EditAbsenceRequestModel model)
    {
        return new AbsenceRequest
        {
            AbsencePeriodStart = model.AbsencePeriodStart,
            AbsencePeriodFinish = model.AbsencePeriodFinish,
            Reason = model.Reason
        };
    }
}
