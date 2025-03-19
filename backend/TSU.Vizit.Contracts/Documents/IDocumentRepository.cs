using FluentResults;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts.Documents;

public interface IDocumentRepository
{
    public Task<Result<Document>> GetDocumentById(Guid id);
    public Task<Result<List<Document>>> GetAllAttachments(Guid AbsenceRequestId);
    public Task<Result<Document>> CreateDocument(Document document);
    public Task<Result> DeleteDocumentById(Guid id);
    public Task<Result> DeleteAttachedDocuments(Guid absenceRequestId);
}
