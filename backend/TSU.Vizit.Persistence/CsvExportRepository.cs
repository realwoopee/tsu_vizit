using FluentResults;
using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Contracts.CsvExport;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Persistence;

public class CsvExportRepository(VizitDbContext dbContext) : ICsvExportRepository
{
    public async Task<Result<List<AbsenceRequest>>> ExportAbsenceRequests()
    {
        return Result.Ok(await dbContext.AbsenceRequest.ToListAsync());
    }

    public async Task<Result<List<AbsenceRequest>>> ExportPersonalAbsenceRequests(Guid userId)
    {
        var query = dbContext.AbsenceRequest.AsQueryable();
        query = query.Where(ar => ar.CreatedById == userId);
        return Result.Ok(await query.ToListAsync());
    }
}
