using System.ComponentModel.DataAnnotations;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserEditProfileModel
{
    [Required] [Length(1, 1000)] public string FullName { get; set; }
    [Required] [EmailAddress] public string Email { get; set; }
}