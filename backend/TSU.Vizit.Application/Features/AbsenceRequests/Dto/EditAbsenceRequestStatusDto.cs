using System.ComponentModel.DataAnnotations;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public class EditAbsenceRequestStatusDto
{
    [Required] public AbsenceRequestResult status { get; set; }
}
