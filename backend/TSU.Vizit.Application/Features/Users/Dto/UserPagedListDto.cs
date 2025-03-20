namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserPagedListDto
{
    public List<UserDto> Users { get; set; }
    public int TotalCount { get; set; }
}
