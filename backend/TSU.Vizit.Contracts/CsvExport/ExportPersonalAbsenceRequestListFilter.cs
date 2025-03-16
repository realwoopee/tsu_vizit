using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts.CsvExport;

public class ExportPersonalAbsenceRequestListFilter
{
    public Guid? FinalisedById { get; set; }
    public AbsenceRequestResult? FinalStatus { get; set; } 
    public AbsenceReason? Reason { get; set; }
}
