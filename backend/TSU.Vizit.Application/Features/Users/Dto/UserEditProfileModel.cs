using System.ComponentModel.DataAnnotations;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Dto;

public class UserEditProfileModel
{
    [Required] [Length(1, 1000)] public string FullName { get; set; }
    public DateOnly? BirthDate { get; set; }
    [Required] [EmailAddress] public string Email { get; set; }
    [Phone] public string? PhoneNumber { get; set; }
}