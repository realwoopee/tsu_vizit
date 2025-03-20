using System.Security.Claims;
using System.Text.Encodings.Web;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Options;
using TSU.Vizit.Application.Features.Auth;
using TSU.Vizit.Application.Features.Users;

namespace TSU.Vizit.Application.Infrastructure.Auth;

public class VizitAuthenticationHandler : AuthenticationHandler<VizitAuthenticationOptions>
{
    private readonly UserService _userService;
    private readonly AuthService _authService;

    public VizitAuthenticationHandler(
        IOptionsMonitor<VizitAuthenticationOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        UserService userService,
        AuthService authService)
        : base(options, logger, encoder)
    {
        _userService = userService;
        _authService = authService;
    }

    protected override async Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        var endpoint = Context.GetEndpoint();
        var validationRequired = endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() != null;

        if (!Request.Headers.TryGetValue(Options.TokenHeaderName, out var tokens))
            return validationRequired
                ? AuthenticateResult.Fail("Missing Authorization Header")
                : AuthenticateResult.NoResult();

        if (tokens.Count != 1)
            return validationRequired
                ? AuthenticateResult.Fail("Invalid Authorization Header")
                : AuthenticateResult.NoResult();

        var token = tokens.First()?[7..];

        if (string.IsNullOrWhiteSpace(token))
            return validationRequired
                ? AuthenticateResult.Fail("Invalid Token")
                : AuthenticateResult.NoResult();

        var validateAndParseResult = await _authService.ValidateAndParseAccessToken(token);

        if (!validateAndParseResult.IsSuccess)
            return AuthenticateResult.Fail(validateAndParseResult.Errors.First().Message);

        var claims = validateAndParseResult.Value;
        var claimsIdentity = new ClaimsIdentity(claims, Scheme.Name);
        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

        return AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, Scheme.Name));
    }
}

public class VizitAuthenticationOptions : AuthenticationSchemeOptions
{
    public const string DefaultScheme = "VizitAuthenticationScheme";
    public string TokenHeaderName { get; set; } = "Authorization";

    // public TokenValidationParameters TokenValidationParameters { get; set; } = new ();
}
