using FluentResults;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Persistence;

public class AbsenceRequestRepository(VizitDbContext dbContext): IAbsenceRequestRepository
{
    public async Task<Result<AbsenceRequest>> GetAbsenceRequestById(Guid id)
    {
        var data = await dbContext.AbsenceRequests.AsNoTracking().FirstOrDefaultAsync(ar => ar.Id == id);
        return data is not null ? data : CustomErrors.NotFound("AbsenceRequest not found");
    }

    public async Task<Result<AbsenceRequest>> CreateAbsenceRequest(AbsenceRequest absenceRequest)
    {
        dbContext.AbsenceRequests.Add(absenceRequest);
        await dbContext.SaveChangesAsync();
        return Result.Ok(absenceRequest);
    }

    public Task<Result<AbsenceRequest>> EditAbsenceRequest(AbsenceRequest absenceRequest)
    {
        throw new NotImplementedException();
    }

    public Task<Result<AbsenceRequestsPagedList>> GetAllAbsenceRequests(AbsenceRequestListFilter filter, AbsenceRequestSorting? sorting,
        PaginationModel? pagination)
    {
        throw new NotImplementedException();
    }
}
