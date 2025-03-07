using FluentResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Persistence;

public class UserRepository(MainDbContext _db, PasswordHasher<User> _passwordHasher) : IUserRepository
{

    public async Task<Result<User>> GetUserById(Guid id)
    {
        var data = await _db.Users.FirstOrDefaultAsync(user => user.Id == id);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User>> GetUserByStudentCardId(string studentIdNumber)
    {
        var data = await _db.Users.FirstOrDefaultAsync(user => user.StudentIdNumber == studentIdNumber);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User>> GetUserByEmail(string email)
    {
        var data = await _db.Users.FirstOrDefaultAsync(user => user.Email == email);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User>> EditUser(Guid id, User newUser)
    {
        var data = await _db.Users.FirstOrDefaultAsync(user => user.Id == id);
        
        if (data is null)
            return CustomErrors.NotFound("User not found");
        
        _db.Entry(data).CurrentValues.SetValues(newUser);
        await _db.SaveChangesAsync();
        return Result.Ok(data);
        
    }

    public async Task<Result<User>> RegisterUser(User user)
    {
        if (_db.Users.Any(u => u.Email == user.Email))
            return Result.Fail(new ValidationError("Email is already registered"));

        if (_db.Users.Any(u => u.FullName == user.FullName))
            return Result.Fail(new ValidationError("FullName is already registered"));

        user.PasswordHash = _passwordHasher.HashPassword(user, user.Password);
        _db.Users.Add(user);
        await _db.SaveChangesAsync();
        return Result.Ok(user);
    }
}