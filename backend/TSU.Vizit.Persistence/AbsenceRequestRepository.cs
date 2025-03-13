using FluentResults;
using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Persistence;

public class AbsenceRequestRepository(VizitDbContext dbContext): IAbsenceRequestRepository
{
    public async Task<Result<AbsenceRequest>> GetAbsenceRequestById(Guid id)
    {
        var data = await dbContext.AbsenceRequest.AsNoTracking().FirstOrDefaultAsync(ar => ar.Id == id);
        return data is not null ? data : CustomErrors.NotFound("AbsenceRequest not found");
    }

    public async Task<Result<AbsenceRequest>> CreateAbsenceRequest(AbsenceRequest absenceRequest)
    {
        dbContext.AbsenceRequest.Add(absenceRequest);
        await dbContext.SaveChangesAsync();
        return Result.Ok(absenceRequest);
    }

    public async Task<Result<AbsenceRequest>> EditAbsenceRequest(AbsenceRequest newAbsenceRequest)
    {
        var data = await dbContext.AbsenceRequest.FirstOrDefaultAsync(ar => ar.Id == newAbsenceRequest.Id);
        
        if (data is null)
            return CustomErrors.NotFound("AbsenceRequest not found");

        dbContext.Entry(data).CurrentValues.SetValues(newAbsenceRequest);
        await dbContext.SaveChangesAsync();
        return Result.Ok(data);
    }

    public async Task<Result<AbsenceRequestPagedList>> GetAllAbsenceRequests(AbsenceRequestListFilter filter, AbsenceRequestSorting? sorting,
        PaginationModel? pagination)
    {
        var query = dbContext.AbsenceRequest.AsQueryable();

        if (filter.CreatedById != null)
            query = query.Where(ar => ar.CreatedById == filter.CreatedById);
        
        if (filter.FinalisedById != null)
            query = query.Where(ar => ar.FinalisedById == filter.FinalisedById);
        
        if (filter.Reason != null)
            query = query.Where(ar => ar.Reason == filter.Reason);
        
        if (filter.FinalStatus != null)
            query = query.Where(ar => ar.FinalStatus == filter.FinalStatus);

        var test = new AbsenceRequestPagedList
        {
            TotalCount = query.Count(),
            AbsenceRequests = await query.ToListAsync()
        };
        return Result.Ok(test);
    }
}
