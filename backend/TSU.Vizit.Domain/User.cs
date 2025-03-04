namespace TSU.Vizit.Domain;

public class User
{
    public Guid Id { get; set; }
    public string Password { get; set; }
    public bool MustChangePassword { get; set; }
    public string? StudentIdNumber { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public bool CanCreate { get; set; }
    public bool CanCheck { get; set; }
    public bool CanApprove { get; set; }
    public bool IsAdmin { get; set; }
}