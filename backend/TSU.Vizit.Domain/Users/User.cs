namespace TSU.Vizit.Domain.Users;

public class User
{
    public Guid Id { get; set; }
    public string PasswordHash { get; set; }
    public bool MustChangePassword { get; set; }
    public string? StudentIdNumber { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public UserRole UserRole { get; set; }
}
