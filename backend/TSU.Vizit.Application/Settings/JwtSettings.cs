namespace TSU.Vizit.Application.Settings;

public class JwtSettings
{
    public string SecretKey { get; set; }

    public string Issuer { get; set; }

    public string Audience { get; set; }

    public int AccessTokenLifetimeSeconds { get; set; }

    public int RefreshTokenLifetimeSeconds { get; set; }
}