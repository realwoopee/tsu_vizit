using System.Security.Claims;
using FluentResults;
using FluentResults.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Application.Settings;
using TSU.Vizit.Contracts;
using TSU.Vizit.Contracts.Users;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Auth;

public class AuthService
{
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly ISessionRepository _sessionRepository;
    private readonly TokenService _tokenService;
    private readonly IUserRepository _userRepository;
    private readonly JwtSettings _jwtSettings;

    public AuthService(PasswordHasher<User> passwordHasher, ISessionRepository sessionRepository,
        TokenService tokenService, IUserRepository userRepository, IOptions<JwtSettings> jwtOptions)
    {
        _passwordHasher = passwordHasher;
        _sessionRepository = sessionRepository;
        _tokenService = tokenService;
        _userRepository = userRepository;
        _jwtSettings = jwtOptions.Value;
    }

    public async Task<Result<LoginResultDto>> LoginUser(UserLoginModel userLoginModel)
    {
        var userResult = await _userRepository.GetUserByEmail(userLoginModel.Email);

        if (userResult.IsFailed)
            return Result.Fail(userResult.Errors);

        var passwordVerificationResult =
            await _userRepository.VerifyUserPassword(userResult.Value, userLoginModel.Password);

        if (passwordVerificationResult.IsFailed)
            return Result.Fail(passwordVerificationResult.Errors);

        var session = _sessionRepository.CreateNewSession(userResult.Value.Id, _jwtSettings.RefreshTokenLifetime);

        var accessTokenResult = _tokenService.IssueAccessToken(userResult.Value, session);
        var refreshTokenResult = _tokenService.IssueRefreshToken(userResult.Value, session);

        if (accessTokenResult.IsFailed || refreshTokenResult.IsFailed)
            return CustomErrors.AuthError("Could not issue token");

        return _sessionRepository.UpdateRefreshToken(session.Id, refreshTokenResult.Value,
                DateTime.UtcNow.Add(_jwtSettings.RefreshTokenLifetime))
            .Bind<LoginResultDto>(
                () => new LoginResultDto
                {
                    Token = accessTokenResult.Value,
                    RefreshToken = refreshTokenResult.Value
                });
    }

    public async Task<Result<LoginResultDto>> RefreshUserToken(string refreshToken)
    {
        var refreshTokenCheck = _tokenService.CheckRefreshToken(refreshToken);
        if (refreshTokenCheck.IsFailed)
            return Result.Fail(new ValidationError("Invalid refresh token"));

        var userIdResult = await _tokenService.GetUserIdFromToken(refreshToken);
        if (userIdResult.IsFailed)
            return Result.Fail(new NotFoundError("User not found"));

        var userResult = await _userRepository.GetUserById(userIdResult.Value);
        if (userIdResult.IsFailed)
            return Result.Fail(userResult.Errors);

        var sessionResult = await _tokenService.GetSessionIdFromToken(refreshToken)
            .Bind(sessionId => _sessionRepository.GetSession(sessionId));

        if (sessionResult.IsFailed)
            return Result.Fail(new ValidationError("Session fetch failed"));

        var session = sessionResult.Value!;

        if (session.RefreshToken != refreshToken)
            return Result.Fail(new ValidationError("Invalid refresh token"));

        if (session.ExpiresAfter < DateTime.UtcNow)
            return Result.Fail(new ValidationError("Session has expired"));

        var newAccessTokenResult = _tokenService.IssueAccessToken(userResult.Value, session);
        var newRefreshTokenResult = _tokenService.IssueRefreshToken(userResult.Value, session);

        if (newAccessTokenResult.IsFailed || newRefreshTokenResult.IsFailed)
            return Result.Fail(new ValidationError("Could not refresh token"));

        return _sessionRepository
            .UpdateRefreshToken(session.Id, newRefreshTokenResult.Value,
                DateTime.UtcNow.Add(_jwtSettings.RefreshTokenLifetime))
            .Bind<LoginResultDto>(() => new LoginResultDto
            {
                Token = newAccessTokenResult.Value,
                RefreshToken = newRefreshTokenResult.Value
            });
    }

    public async Task<Result<List<Claim>>> ValidateAndParseAccessToken(string accessToken)
    {
        var userResult = await _tokenService.GetUserIdFromToken(accessToken)
            .Bind(async userId =>
            {
                var user = await _userRepository.GetUserById(userId);
                return user.IsSuccess
                    ? Result.Ok(user.Value)
                    : CustomErrors.NotFound("User not found");
            });

        if (userResult.IsFailed)
            return Result.Fail(new ValidationError("User fetch failed"));

        var user = userResult.Value!;
        var sessionResult = await _tokenService.GetSessionIdFromToken(accessToken)
            .Bind(sessionId => _sessionRepository.GetSession(sessionId));

        if (sessionResult.IsFailed)
            return Result.Fail(new ValidationError("Session fetch failed"));

        var session = sessionResult.Value!;

        if (session.ExpiresAfter < DateTime.UtcNow)
            return Result.Fail(new ValidationError("Session has expired"));

        return Result.Ok<List<Claim>>(
        [
            new Claim(VizitClaimTypes.UserId, user.Id.ToString()),
            new Claim(VizitClaimTypes.SessionId, session.Id.ToString())
        ]);
    }

    public async Task<Result> ChangeUserPassword(UserChangePasswordModel model)
    {
        var userResult = await _userRepository.GetUserByEmail(model.Email);
        if (userResult.IsFailed)
            return Result.Fail(userResult.Errors);

        var result =
            _passwordHasher.VerifyHashedPassword(userResult.Value, userResult.Value.PasswordHash, model.OldPassword);

        if (result == PasswordVerificationResult.Failed)
            return CustomErrors.ValidationError("Invalid password");

        userResult.Value.PasswordHash = _passwordHasher.HashPassword(userResult.Value, model.NewPassword);
        _sessionRepository.ClearSessions(userResult.Value.Id);

        return Result.Ok();
    }


    public async Task<Result<LoginResultDto>> RegisterUser(UserRegisterModel model)
    {
        var user = model.ToUser();
        user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);

        return await _userRepository.CreateUser(user)
            .Bind(async newUser =>
                await LoginUser(new UserLoginModel { Email = newUser.Email, Password = model.Password }));
    }
}
