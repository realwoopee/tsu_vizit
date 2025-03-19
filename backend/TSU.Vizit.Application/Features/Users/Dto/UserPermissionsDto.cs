using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserPermissionsDto
{
    public bool CanCreate { get; set; } = false;
    public bool CanCheck { get; set; } = false;
    public bool CanApprove { get; set; } = false;
    public bool IsAdmin { get; set; } = false;
    public bool CanExportAll { get; set; } = false;
}
