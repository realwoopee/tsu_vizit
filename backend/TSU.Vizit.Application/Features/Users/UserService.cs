using System.Security.Claims;
using FluentResults;
using FluentResults.Extensions;
using Microsoft.AspNetCore.Identity;
using TSU.Vizit.Application.Features.Dto;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Application.Services.Auth;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features;

public class UserService
{
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly SessionService _sessionService;
    private readonly TokenService _tokenService;
    private readonly IUserRepository _userRepository;

    public UserService(TokenService tokenService, PasswordHasher<User> passwordHasher,
        SessionService sessionService, IUserRepository userRepository)
    {
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
        _sessionService = sessionService;
        _userRepository = userRepository;
    }

    public async Task<Result<UserDto>> GetUserById(Guid userId)
    {
        var user = await _userRepository.GetUserById(userId);
        
        if (user == null)
            return Result.Fail(new NotFoundError("User not found"));
        
        return UserDtoConverters.ToDto(user);
    }

    public async Task<Result<UserDto>> EditUserById(Guid userId, UserEditProfileModel model)
    {
        var user = await _userRepository.GetUserById(userId);
        
        if (user == null)
            return CustomErrors.NotFound("User not found");
        
        user = UserDtoConverters.ToUser(model, user);
        await _userRepository.EditUser(user.Id, user);
        return Result.Ok(UserDtoConverters.ToDto(user));
        
    }

    public async Task<Result<LoginResultDto>> LoginUser(UserLoginModel userLoginModel)
    {
        var user = await _userRepository.GetUserByEmail(userLoginModel.Email);
        
        await _userRepository.LoginUser(user); // TODO: Deal with fail cases
        
        var session = _sessionService.CreateNewSession(user.Id, TimeSpan.FromDays(7));

        var accessTokenResult = _tokenService.IssueAccessToken(user, session);
        var refreshTokenResult = _tokenService.IssueRefreshToken(user, session);

        if (accessTokenResult.IsFailed || refreshTokenResult.IsFailed)
            return Result.Fail(new ValidationError("Could not issue token"));

        return _sessionService.UpdateRefreshToken(session.Id, refreshTokenResult.Value, DateTime.UtcNow.AddDays(7))
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
        
        var sessionResult = await _tokenService.GetSessionIdFromToken(refreshToken)
            .Bind(sessionId => _sessionService.GetSession(sessionId));
        
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
        
        return _sessionService.UpdateRefreshToken(session.Id, newRefreshTokenResult.Value, DateTime.UtcNow.AddDays(7))
            .Bind<LoginResultDto>(() => new LoginResultDto
            {
                Token = newAccessTokenResult.Value,
                RefreshToken = newRefreshTokenResult.Value
            });
    }

    public async Task<Result<List<Claim>>> ValidateAndParseAccessToken(string accessToken)
    {
        throw new NotImplementedException();
        // var userResult = await _tokenService.GetUserIdFromToken(accessToken)
        //     .Bind(async userId =>
        //     {
        //         var user = await _userRepository.GetUserById(userId);
        //         return user != null
        //             ? Result.Ok(user)
        //             : CustomErrors.NotFound("User not found");
        //     });
        //
        // if (userResult.IsFailed)
        //     return Result.Fail(new ValidationError("User fetch failed"));
        //
        // var user = userResult.Value!;
        //
        // var sessionResult = _tokenService.GetSessionIdFromToken(accessToken)
        //     .Bind(sessionId => _sessionService.GetSession(sessionId));
        //
        // if (sessionResult.IsFailed)
        //     return Result.Fail(new ValidationError("Session fetch failed"));
        //
        // var session = sessionResult.Value!;
        //
        // if (session.ExpiresAfter < DateTime.UtcNow)
        //     return Result.Fail(new ValidationError("Session has expired"));
        //
        // return Result.Ok<List<Claim>>(
        // [
        //     new Claim(BlogClaimTypes.UserId, user.Id.ToString()),
        //     new Claim(BlogClaimTypes.SessionId, session.Id.ToString())
        // ]);
    }

    public async Task<Result> ChangeUserPassword(UserChangePasswordModel model)
    {
        throw new NotImplementedException();
        // var user = _db.Users.FirstOrDefault(u => u.Email == model.Email);
        // if (user is null)
        //     return CustomErrors.NotFound("User not found");
        //
        // var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, model.OldPassword);
        //
        // if (result == PasswordVerificationResult.Failed)
        //     return CustomErrors.ValidationError("Invalid password");
        //
        // user.PasswordHash = _passwordHasher.HashPassword(user, model.NewPassword);
        // _sessionService.ClearSessions(user.Id);
        // await _db.SaveChangesAsync();
        //
        // return Result.Ok();
    }

    public async Task<Result<LoginResultDto>> RegisterUser(UserRegisterModel model)
    {
        throw new NotImplementedException();
        // if (_db.Users.Any(u => u.Email == model.Email))
        //     return Result.Fail(new ValidationError("Email is already registered"));
        //
        // if (_db.Users.Any(u => u.FullName == model.FullName))
        //     return Result.Fail(new ValidationError("FullName is already registered"));
        //
        // var user = model.ToUser();
        // user.PasswordHash = _passwordHasher.HashPassword(user, model.Password);
        // _db.Users.Add(user);
        // await _db.SaveChangesAsync();
        //
        // return LoginUser(new UserLoginModel { Email = model.Email, Password = model.Password });
    }
}