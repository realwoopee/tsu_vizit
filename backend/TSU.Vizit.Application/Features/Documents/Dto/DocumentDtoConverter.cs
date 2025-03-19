using Microsoft.EntityFrameworkCore.Infrastructure;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Documents.Dto;

public static class DocumentDtoConverter
{
    public static DocumentDto ToDto(this Document document)
    {
        return new DocumentDto
        {
            Id = document.Id,
            AbsenceRequestId = document.AbsenceRequestId,
            Attachment = document.Attachment
        };
    }

    public static DocumentShortDto ToShortDto(this Document document)
    {
        return new DocumentShortDto
        {
            Id = document.Id
        };
    }
}
