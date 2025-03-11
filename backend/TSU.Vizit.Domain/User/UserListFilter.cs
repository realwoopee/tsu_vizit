namespace TSU.Vizit.Domain;

public class UserListFilter
{
    // public bool MustChangePassword { get; set; }
    public string? StudentIdNumber { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public Roles? Role { get; set; }
}