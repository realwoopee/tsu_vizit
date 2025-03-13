using FluentResults;
using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Persistence;

public class DocumentRepository(VizitDbContext dbContext): IDocumentRepository
{
    public async Task<Result<List<Document>>> GetAllAttachments(Guid AbsenceRequestId)
    {
        var documents = dbContext.Document.AsQueryable();
        documents = documents.Where(d => d.AbsenceRequestId == AbsenceRequestId);
        var result = await documents.ToListAsync();
        return Result.Ok(result);
    }
}

