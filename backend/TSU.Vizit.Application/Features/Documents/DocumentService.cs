using FluentResults;
using TSU.Vizit.Application.Features.Documents.Dto;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Documents;

public class DocumentService(IDocumentRepository _documentRepository)
{
    public async Task<Result<Document>> CreateDocument(AttachDocumentDto dto)
    {
        var document = new Document
        {
            AbsenceRequestId = dto.AbsenceRequestId,
            Attachment = dto.Attachment
        };
        return await _documentRepository.CreateDocument(document);
    }

}
