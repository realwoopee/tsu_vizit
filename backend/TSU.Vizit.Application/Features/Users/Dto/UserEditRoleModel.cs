using System.ComponentModel.DataAnnotations;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserEditRoleModel
{
    [Required] public Guid Id { get; set; }
    [Required] public UserRole UserRole { get; set; }
}