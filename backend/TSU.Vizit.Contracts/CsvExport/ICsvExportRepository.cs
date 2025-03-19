using FluentResults;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts.CsvExport;

public interface ICsvExportRepository
{
    public Task<Result<List<AbsenceRequest>>> ExportAbsenceRequests(ExportAllAbsenceRequestListFilter filter);
}
