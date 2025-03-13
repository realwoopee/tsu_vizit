
using FluentResults;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts.Documents;

public interface IDocumentRepository
{
    public Task<Result<List<Document>>> GetAllAttachments(Guid AbsenceRequestId);
}
