namespace TSU.Vizit.Domain;

public class User
{
    public Guid Id { get; set; }
    public string PasswordHash { get; set; }
    public bool MustChangePassword { get; set; }
    public string? StudentIdNumber { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public bool CanCreate { get; set; }
    public bool CanCheck { get; set; }
    public bool CanApprove { get; set; }
    public bool IsAdmin { get; set; }
    public Roles Role
    {
        get
        {
            if (IsAdmin)
                return Roles.Admin;
            
            if (CanApprove)
                return Roles.DeansEmployee;
            
            if (CanCheck)
                return Roles.Teacher;
            
            return Roles.Student;
        }
        set
        {
            if (value == Roles.Admin)
            {
                IsAdmin = true;
                CanApprove = true;
                CanCheck = true;
                CanCreate = true;
            }
            if (value == Roles.DeansEmployee)
            {
                CanApprove = true;
                CanCheck = true;
                CanCreate = true;
            }
            if (value == Roles.Teacher)
            {
                CanCheck = true;
                CanCreate = true;
            }
            if (value == Roles.Student)
            {
                CanCreate = true;
            }
        }
    }
}