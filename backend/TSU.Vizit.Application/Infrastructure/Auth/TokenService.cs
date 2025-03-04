using System.Security.Claims;
using System.Text;
using FluentResults;
using FluentResults.Extensions;
using Microsoft.IdentityModel.JsonWebTokens;
using Microsoft.IdentityModel.Tokens;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Infrastructure.Auth;

public class TokenService
{
    // TODO: pull token lifetimes from configuration
    private readonly IConfiguration _configuration;

    public TokenService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public Result<string> IssueAccessToken(User user, Session session)
    {
        return GenerateToken(user, session, DateTime.UtcNow.AddMinutes(5));
    }

    public Result<string> IssueRefreshToken(User user, Session session, string? previousRefreshToken = null)
    {
        return GenerateToken(user, session, DateTime.UtcNow.AddDays(7));
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
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            Subject = new ClaimsIdentity(claims),
            Expires = expirationDate,
            SigningCredentials =
                new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
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