using System.ComponentModel.DataAnnotations;
using TSU.Vizit.Contracts;
using TSU.Vizit.Contracts.Users;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class GetAllUsersModel
{
    public GetAllUsersModel()
    {
        Pagination = new PaginationModel();
    }
    public string? StudentIdNumber { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public UserRole? Role { get; set; }
    public UserSorting? Sorting { get; set; }
    public PaginationModel? Pagination { get; set; }
}
