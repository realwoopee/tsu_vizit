using FluentResults;
using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Contracts.CsvExport;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Persistence;

public class CsvExportRepository(VizitDbContext dbContext) : ICsvExportRepository
{
    public async Task<Result<List<AbsenceRequest>>> ExportAbsenceRequests(ExportAllAbsenceRequestListFilter filter)
    {
        var query = dbContext.AbsenceRequest.AsNoTracking().AsQueryable();

        if (filter.CreatedById == null)
            query = query.Where(ar => ar.CreatedById == filter.CreatedById);

        if (filter.FinalisedById == null)
            query = query.Where(ar => ar.FinalisedById == filter.FinalisedById);

        if (filter.Reason == null)
            query = query.Where(ar => ar.Reason == filter.Reason);

        if (filter.FinalStatus == null)
            query = query.Where(ar => ar.FinalStatus == filter.FinalStatus);

        return Result.Ok(await query.ToListAsync());
    }
}
