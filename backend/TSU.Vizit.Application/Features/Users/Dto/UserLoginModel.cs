using System.ComponentModel.DataAnnotations;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserLoginModel
{
    [Required]
    [MinLength(1)]
    [EmailAddress]
    public string Email { get; set; }

    [Required] [MinLength(1)] public string Password { get; set; }
}
