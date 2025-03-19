using FluentResults;
using Microsoft.EntityFrameworkCore;
using NeinLinq;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Persistence;

public class AbsenceRequestRepository(VizitDbContext dbContext) : IAbsenceRequestRepository
{
    public async Task<Result<AbsenceRequest>> GetAbsenceRequestById(Guid id)
    {
        var data = await dbContext.AbsenceRequest.AsNoTracking()
            .Include(ab => ab.Attachments).FirstOrDefaultAsync(ar => ar.Id == id);
        // CanCheck or creator
        
        
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

    public async Task<Result<AbsenceRequestPagedList>> GetAllAbsenceRequests(AbsenceRequestListFilter filter, //Include?
        AbsenceRequestSorting? sorting,
        PaginationModel? pagination)
    {
        var query = dbContext.AbsenceRequest.AsNoTracking().Include(ar => ar.Attachments).AsQueryable();

        if (filter.CreatedById != null)
            query = query.Where(ar => ar.CreatedById == filter.CreatedById);

        if (filter.FinalisedById != null)
            query = query.Where(ar => ar.FinalisedById == filter.FinalisedById);

        if (filter.Reason != null)
            query = query.Where(ar => ar.Reason == filter.Reason);

        if (filter.FinalStatus != null)
            query = query.Where(ar => ar.FinalStatus == filter.FinalStatus);

        query = sorting switch
        {
            AbsenceRequestSorting.TimeCreatedAsc => query.OrderBy(ar => ar.TimeCreated),
            AbsenceRequestSorting.TimeCreatedDesc => query.OrderByDescending(ar => ar.TimeCreated),
            AbsenceRequestSorting.TimeFinalisedAsc => query.OrderBy(ar => ar.TimeFinalised),
            AbsenceRequestSorting.TimeFinalisedDesc => query.OrderByDescending(ar => ar.TimeFinalised),
            null => query,
            _ => throw new ArgumentOutOfRangeException(nameof(sorting), sorting, $"Invalid sorting value: {sorting}")
        };

        if (pagination is not null)
            query = query
                .Skip(pagination.Offset)
                .Take(pagination.Limit);

        var absenceRequestAuthorNames = new List<string>();
        var absenceRequests = await query.ToListAsync();
        var itemsToRemove = new List<AbsenceRequest>();
        foreach (var absenceRequest in absenceRequests)
        {
            var userId = absenceRequest.CreatedById;
            var user = await dbContext.Users.FirstOrDefaultAsync(ar => ar.Id == userId);
            if (!string.IsNullOrEmpty(filter.CreatedBy) && !user.FullName.Contains(filter.CreatedBy))
            {
                itemsToRemove.Add(absenceRequest);
                continue;
            }
            absenceRequestAuthorNames.Add(user.FullName);
        }
        
        foreach (var item in itemsToRemove)
        {
            absenceRequests.Remove(item);
        }
        
        return new AbsenceRequestPagedList
        {
            TotalCount = absenceRequests.Count,
            AbsenceRequests = absenceRequests,
            AbsenceRequestAuthorNames = absenceRequestAuthorNames
        };
    }

    public async Task<Result> DeleteAbsenceRequest(Guid absenceRequestId)
    {
        var data = await dbContext.AbsenceRequest.FirstOrDefaultAsync(ar => ar.Id == absenceRequestId);

        if (data is null)
            return CustomErrors.NotFound("AbsenceRequest not found");

        dbContext.AbsenceRequest.Remove(data);
        await dbContext.SaveChangesAsync();
        return Result.Ok();
    }
}
