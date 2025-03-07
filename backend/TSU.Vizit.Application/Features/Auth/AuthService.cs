using FluentResults;
using FluentResults.Extensions;
using Microsoft.AspNetCore.Identity;
using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Auth;

public class AuthService
{
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly ISessionRepository _sessionRepository;
    private readonly TokenService _tokenService;
    private readonly IUserRepository _userRepository;

    public AuthService(PasswordHasher<User> passwordHasher, ISessionRepository sessionRepository,
        TokenService tokenService, IUserRepository userRepository)
    {
        _passwordHasher = passwordHasher;
        _sessionRepository = sessionRepository;
        _tokenService = tokenService;
        _userRepository = userRepository;
    }

    public async Task<Result<LoginResultDto>> LoginUser(UserLoginModel userLoginModel)
    {
        var user = await _userRepository.GetUserByEmail(userLoginModel.Email);

        if (user == null)
            return CustomErrors.AuthError("Invalid credentials");

        var session = _sessionRepository.CreateNewSession(user.Id, TimeSpan.FromDays(7));

        var accessTokenResult = _tokenService.IssueAccessToken(user, session);
        var refreshTokenResult = _tokenService.IssueRefreshToken(user, session);

        if (accessTokenResult.IsFailed || refreshTokenResult.IsFailed)
            return CustomErrors.AuthError("Could not issue token");

        return _sessionRepository.UpdateRefreshToken(session.Id, refreshTokenResult.Value, DateTime.UtcNow.AddDays(7))
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

        var user = await _userRepository.GetUserById(userIdResult.Value);
        if (user == null)
            return Result.Fail(new NotFoundError("User not found"));

        var sessionResult = await _tokenService.GetSessionIdFromToken(refreshToken)
            .Bind(sessionId => _sessionRepository.GetSession(sessionId));

        if (sessionResult.IsFailed)
            return Result.Fail(new ValidationError("Session fetch failed"));

        var session = sessionResult.Value!;

        if (session.RefreshToken != refreshToken)
            return Result.Fail(new ValidationError("Invalid refresh token"));

        if (session.ExpiresAfter < DateTime.UtcNow)
            return Result.Fail(new ValidationError("Session has expired"));

        var newAccessTokenResult = _tokenService.IssueAccessToken(user, session);
        var newRefreshTokenResult = _tokenService.IssueRefreshToken(user, session);

        if (newAccessTokenResult.IsFailed || newRefreshTokenResult.IsFailed)
            return Result.Fail(new ValidationError("Could not refresh token"));

        return _sessionRepository
            .UpdateRefreshToken(session.Id, newRefreshTokenResult.Value, DateTime.UtcNow.AddDays(7))
            .Bind<LoginResultDto>(() => new LoginResultDto
            {
                Token = newAccessTokenResult.Value,
                RefreshToken = newRefreshTokenResult.Value
            });
    }
}