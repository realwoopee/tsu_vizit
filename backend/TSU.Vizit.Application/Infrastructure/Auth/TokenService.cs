using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FluentResults;
using FluentResults.Extensions;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using TSU.Vizit.Application.Settings;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Application.Infrastructure.Auth;

public class TokenService
{
    // TODO: pull token lifetimes from configuration
    private readonly JwtSettings _settings;

    public TokenService(IOptions<JwtSettings> options)
    {
        _settings = options.Value;
    }

    public Result<string> IssueAccessToken(User user, Session session)
    {
        return GenerateToken(user, session, DateTime.UtcNow.Add(_settings.AccessTokenLifetime));
    }

    public Result<string> IssueRefreshToken(User user, Session session, string? previousRefreshToken = null)
    {
        return GenerateToken(user, session, DateTime.UtcNow.Add(_settings.RefreshTokenLifetime));
    }

    public Result CheckRefreshToken(string refreshToken)
    {
        return ValidateToken(refreshToken).ToResult();
    }

    private Result<ClaimsPrincipal> ValidateToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey)),
            ValidateLifetime = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = _settings.Issuer,
            ValidAudience = _settings.Audience
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        return Result.Try(() => tokenHandler.ValidateToken(token, tokenValidationParameters, out _),
            e => new ExceptionalError(e.Message, e));
    }

    private Result<string> GenerateToken(User user, Session session, DateTime expirationDate)
    {
        var claims = new[]
        {
            new Claim(VizitClaimTypes.UserId, user.Id.ToString()),
            new Claim(VizitClaimTypes.SessionId, session.Id.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _settings.Issuer,
            Audience = _settings.Audience,
            Subject = new ClaimsIdentity(claims),
            Expires = expirationDate,
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey)),
                    SecurityAlgorithms.HmacSha256)
        };

        var handler = new JsonWebTokenHandler();

        return Result.Try(() => handler.CreateToken(tokenDescriptor), e => new ExceptionalError(e.Message, e));
    }

    public async Task<Result<Guid>> GetUserIdFromToken(string token)
    {
        return await GetPrincipalFromExpiredToken(token)
            .Map(identity =>
                identity?.Claims.FirstOrDefault(x => x.Type == VizitClaimTypes.UserId))
            .Bind(sessionIdClaim => sessionIdClaim != null
                ? Guid.Parse(sessionIdClaim.Value)
                : Result.Fail<Guid>(new TokenServiceError("Invalid token")));
    }

    public async Task<Result<Guid>> GetSessionIdFromToken(string token)
    {
        return await GetPrincipalFromExpiredToken(token)
            .Map(principal =>
                principal?.Claims.FirstOrDefault(x => x.Type == VizitClaimTypes.SessionId))
            .Bind(sessionIdClaim => sessionIdClaim != null
                ? Guid.Parse(sessionIdClaim.Value)
                : Result.Fail<Guid>(new TokenServiceError("Invalid token")));
    }

    public async Task<Result<ClaimsIdentity>> GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = false,
            ValidateIssuer = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.SecretKey)),
            ValidateLifetime = false
        };

        var tokenHandler = new JsonWebTokenHandler();
        var validationResult = await tokenHandler.ValidateTokenAsync(token, tokenValidationParameters);

        if (!validationResult.IsValid || !(validationResult.SecurityToken is JsonWebToken jwt) ||
            !jwt.Alg.Equals(SecurityAlgorithms.HmacSha256,
                StringComparison.InvariantCultureIgnoreCase))
            return Result.Fail(new TokenServiceError("Invalid token"));

        return validationResult.ClaimsIdentity;
    }
}
