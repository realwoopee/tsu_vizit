using System.ComponentModel.DataAnnotations;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserRegisterModel
{
    [Required] [Length(1, 1000)] public string FullName { get; set; }

    [Required] [EmailAddress] public string Email { get; set; }

    [Required] [MinLength(6)] public string Password { get; set; }
    [StringLength(6, MinimumLength = 6)] public string StudentIdNumber { get; set; }
}