using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.AbsenceRequests.Dto;

public class AbsenceRequestPagedListDto
{
    public List<AbsenceRequestDto> AbsenceRequests { get; set; }
    public int TotalCount { get; set; }
}
