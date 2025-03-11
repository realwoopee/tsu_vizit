using TSU.Vizit.Application.Utils.Pagination.Dto;
using TSU.Vizit.Domain.Paginaiton;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserPagedListDto
{
    public List<UserDto> Users { get; set; }

    public PaginationDto Pagination { get; set; } 
}