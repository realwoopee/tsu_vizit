using System.ComponentModel.DataAnnotations;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public class EditAbsenceRequestModel
{
    [Required] public DateOnly AbsencePeriodStart { get; set; }
    [Required] public DateOnly AbsencePeriodFinish { get; set; }
    [Required] public AbsenceReason Reason { get; set; }
}
