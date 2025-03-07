using System.ComponentModel.DataAnnotations;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Features.Dto;

public class UserEditProfileModel
{
    [Required] [Length(1, 1000)] public string FullName { get; set; }
}