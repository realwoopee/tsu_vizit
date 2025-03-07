using System.Security.Claims;
using FluentResults;
using TSU.Vizit.Application.Features.Auth.Dto;
using TSU.Vizit.Application.Features.Users.Dto;
using TSU.Vizit.Contracts;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Application.Features.Users;

public class UserService(IUserRepository userRepository)
{
    public async Task<Result<UserDto>> GetUserById(Guid userId)
    {
        var user = await userRepository.GetUserById(userId);

        if (user == null)
            return Result.Fail(new NotFoundError("User not found"));

        return user.ToDto();
    }

    public async Task<Result<UserDto>> EditUserById(Guid userId, UserEditProfileModel model)
    {
        var user = await userRepository.GetUserById(userId);

        if (user == null)
            return CustomErrors.NotFound("User not found");

        user = model.ToUser(user);
        await userRepository.EditUser(user.Id, user);
        return Result.Ok(user.ToDto());
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