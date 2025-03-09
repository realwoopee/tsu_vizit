namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserRolesDto
{
    public bool CanCreate { get; set; }
    public bool CanCheck { get; set; }
    public bool CanApprove { get; set; }
    public bool IsAdmin { get; set; }
}