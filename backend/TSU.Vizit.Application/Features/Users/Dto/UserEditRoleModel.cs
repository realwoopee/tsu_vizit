using System.ComponentModel.DataAnnotations;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserEditRoleModel
{
    [Required] public Guid Id { get; set; }
    [Required] public Roles Role { get; set; }
}