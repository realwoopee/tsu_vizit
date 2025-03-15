using FluentResults;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts.AbsenceRequests;

public interface IAbsenceRequestRepository
{
    public Task<Result<AbsenceRequest>> GetAbsenceRequestById(Guid id);
    public Task<Result<AbsenceRequest>> CreateAbsenceRequest(AbsenceRequest absenceRequest);
    public Task<Result<AbsenceRequest>> EditAbsenceRequest(AbsenceRequest newAbsenceRequest);
    public Task<Result<AbsenceRequestPagedList>> GetAllAbsenceRequests(AbsenceRequestListFilter filter,
        AbsenceRequestSorting? sorting, PaginationModel? pagination);
    
    public Task<Result> DeleteAbsenceRequest(Guid absenceRequestId);
    
}
