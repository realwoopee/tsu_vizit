using FluentResults;
using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;
using TSU.Vizit.Infrastructure.Errors;

namespace TSU.Vizit.Persistence;

public class UserRepository(MainDbContext _db) : IUserRepository
{
    public async Task<Result<User?>> GetUserById(Guid id)
    {
        var data = await _db.Users.FirstOrDefaultAsync(user => user.Id == id);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User?>> GetUserByStudentCardId(string studentIdNumber)
    {
        var data = await _db.Users.FirstOrDefaultAsync(user => user.StudentIdNumber == studentIdNumber);
        return data is not null ? data : CustomErrors.NotFound("User not found");
    }

    public async Task<Result<User?>> GetUserByEmail(string email)
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

    public Task<Result<User?>> RegisterUser(User user)
    {
        throw new NotImplementedException();
    }
}