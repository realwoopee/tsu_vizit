using FluentResults;
using FluentResults.Extensions;
using TSU.Vizit.Application.Features.Documents.Dto;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Documents;

public class DocumentService(IDocumentRepository _documentRepository, IAbsenceRequestRepository _absenceRequestRepository)
{
    public async Task<Result<Document>> CreateDocument(AttachDocumentDto dto)
    {
        var absenceRequest = await _absenceRequestRepository.GetAbsenceRequestById(dto.AbsenceRequestId);
        
        if (absenceRequest.IsFailed)
            return Result.Fail(absenceRequest.Errors);
        
        var document = new Document
        {
            AbsenceRequestId = dto.AbsenceRequestId,
            Attachment = dto.Attachment
        };
        return await _documentRepository.CreateDocument(document);
    }

}
