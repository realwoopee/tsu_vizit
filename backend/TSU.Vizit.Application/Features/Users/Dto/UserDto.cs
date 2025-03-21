﻿using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Application.Features.Users.Dto;

public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string? StudentCardId { get; set; }
    public UserRole? Role { get; set; }
}
