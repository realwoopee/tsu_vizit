namespace TSU.Vizit.Application.Infrastructure.Auth;

public class Session
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string LastIp { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime ExpiresAfter { get; set; }
}