using FluentResults;
using FluentResults.Extensions;
using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Persistence;

public class DocumentRepository(VizitDbContext dbContext) : IDocumentRepository
{
    
    public async Task<Result<Document>> GetDocumentById(Guid id)
    {
        var data = await dbContext.Document.FirstOrDefaultAsync(document => document.Id == id);
        return data is not null ? data : CustomErrors.NotFound("Document not found");
    }

    public async Task<Result<List<Document>>> GetAllAttachments(Guid absenceRequestId)
    {
        var documents = dbContext.Document.AsNoTracking().AsQueryable();
        documents = documents.Where(d => d.AbsenceRequestId == absenceRequestId);
        var result = await documents.ToListAsync();
        return Result.Ok(result);
    }

    public async Task<Result<Document>> CreateDocument(Document document)
    {
        dbContext.Document.Add(document);
        await dbContext.SaveChangesAsync();
        return Result.Ok(document);
    }

    public async Task<Result> DeleteDocumentById(Guid id)
    {
        var document = await dbContext.Document.FirstOrDefaultAsync(document => document.Id == id);

        if (document == null)
            return new NotFoundError("Document not found.");

        dbContext.Document.Remove(document);
        await dbContext.SaveChangesAsync();
        return Result.Ok();
    }

    public async Task<Result> DeleteAttachedDocuments(Guid absenceRequestId)
    {
        var docsToDelete = await dbContext.Document.Where(document => document.AbsenceRequestId == absenceRequestId)
            .ToListAsync();
        dbContext.Document.RemoveRange(docsToDelete);
        await dbContext.SaveChangesAsync();
        return Result.Ok();
    }
}
