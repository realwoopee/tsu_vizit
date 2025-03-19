using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Documents.Dto;

public static class DocumentDtoConverter
{
    public static DocumentDto ToDto(this Document document)
    {
        return new DocumentDto
        {
            Id = document.Id,
            Attachment = document.Attachment
        };
    }
}
