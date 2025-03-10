using System.ComponentModel.DataAnnotations;
using FluentResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Persistence;

public class UserRepository(VizitDbContext dbContext, PasswordHasher<User> _passwordHasher) : IUserRepository
{

    public async Task<Result<User>> GetUserById(Guid id)
    {
        var data = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Id == id);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User>> GetUserByStudentCardId(string studentIdNumber)
    {
        var data = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(user => user.StudentIdNumber == studentIdNumber);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User>> GetUserByEmail(string email)
    {
        var data = await dbContext.Users.AsNoTracking().FirstOrDefaultAsync(user => user.Email == email);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User>> EditUser(Guid id, User newUser)
    {
        var data = await dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
        
        if (data is null)
            return CustomErrors.NotFound("User not found");

        try
        {
            dbContext.Entry(data).CurrentValues.SetValues(newUser);
            await dbContext.SaveChangesAsync();
            return Result.Ok(data);
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pgex && pgex.SqlState == "23505")
        {
            var error = pgex.ConstraintName switch
            {
                "IX_Users_Email" => "Email is already registered",
                "IX_Users_StudentIdNumber" => "StudentIdNumber is already registered",
                _ => throw new ArgumentOutOfRangeException($"Unhandled constraint name: {pgex.ConstraintName}")
            };
            return CustomErrors.ValidationError(error);
        }
    }

    public async Task<Result<User>> CreateUser(User user)
    {
        try
        {
            dbContext.Users.Add(user);
            await dbContext.SaveChangesAsync();
            return Result.Ok(user);
        }
        catch (DbUpdateException ex) when (ex.InnerException is PostgresException pgex && pgex.SqlState == "23505")
        {
            var error = pgex.ConstraintName switch
            {
                "IX_Users_Email" => "Email is already registered",
                "IX_Users_StudentIdNumber" => "StudentIdNumber is already registered",
                _ => throw new ArgumentOutOfRangeException($"Unhandled constraint name: {pgex.ConstraintName}")
            };
            return CustomErrors.ValidationError(error);
        }
    }
}