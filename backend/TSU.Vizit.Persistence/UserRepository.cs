using System.ComponentModel.DataAnnotations;
using FluentResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Persistence;

public class UserRepository(VizitDbContext dbContext, PasswordHasher<User> _passwordHasher) : IUserRepository
{

    public async Task<Result<User>> GetUserById(Guid id)
    {
        var data = await dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User>> GetUserByStudentCardId(string studentIdNumber)
    {
        var data = await dbContext.Users.FirstOrDefaultAsync(user => user.StudentIdNumber == studentIdNumber);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User>> GetUserByEmail(string email)
    {
        var data = await dbContext.Users.FirstOrDefaultAsync(user => user.Email == email);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User>> EditUser(Guid id, User newUser)
    {
        var data = await dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
        
        if (data is null)
            return CustomErrors.NotFound("User not found");
        
        if (newUser.FullName == data.FullName)
            return CustomErrors.ValidationError("FullName has to change.");
        
        dbContext.Entry(data).CurrentValues.SetValues(newUser);
        await dbContext.SaveChangesAsync();
        return Result.Ok(data);
        
    }

    public async Task<Result<User>> CreateUser(User user)
    {
        if (dbContext.Users.Any(u => u.Email == user.Email))
            return Result.Fail(new ValidationError("Email is already registered"));

        if (dbContext.Users.Any(u => u.FullName == user.FullName))
            return Result.Fail(new ValidationError("FullName is already registered"));
        
        if (dbContext.Users.Any(u => u.StudentIdNumber == user.StudentIdNumber))
            return Result.Fail(new ValidationError("StudentIdNumber is already registered"));

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
        return Result.Ok(user);
    }
}