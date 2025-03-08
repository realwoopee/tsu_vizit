namespace TSU.Vizit.Application.Settings;

public class JwtSettings
{
    public string SecretKey { get; set; }

    public string Issuer { get; set; }

    public string Audience { get; set; }

    public TimeSpan AccessTokenLifetime { get; set; }

    public TimeSpan RefreshTokenLifetime { get; set; }
}