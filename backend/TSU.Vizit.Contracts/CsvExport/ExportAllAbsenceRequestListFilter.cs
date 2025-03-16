using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts.CsvExport;

public class ExportAllAbsenceRequestListFilter
{
    public Guid? CreatedById { get; set; }
    public Guid? FinalisedById { get; set; }
    public AbsenceRequestResult? FinalStatus { get; set; } 
    public AbsenceReason? Reason { get; set; }
}
