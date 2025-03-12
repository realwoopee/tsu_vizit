using System.ComponentModel.DataAnnotations;
using FluentResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;
using Npgsql;
using TSU.Vizit.Contracts;
using TSU.Vizit.Contracts.Users;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;
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

    public async Task<Result<UserPagedList>> GetAllUsers(UserListFilter filter,
        UserSorting? sorting,
        PaginationModel? pagination)
    {
        var query = dbContext.Users.AsQueryable();
        
        if (!string.IsNullOrWhiteSpace(filter?.Email))
            query = query.Where(user => user.Email.Contains(filter.Email));
        
        if (!string.IsNullOrWhiteSpace(filter?.StudentIdNumber))
            query = query.Where(user => user.StudentIdNumber.Contains(filter.StudentIdNumber));
        
        if (!string.IsNullOrWhiteSpace(filter?.FullName))
            query = query.Where(user => user.FullName.Contains(filter.FullName));

        if (filter?.Role is not null)
        {
            query = filter.Role switch
            {
                UserRole.Admin => query.Where(user => user.UserRole == UserRole.Admin),
                UserRole.DeansEmployee => query.Where(user => user.UserRole == UserRole.DeansEmployee),
                UserRole.Teacher => query.Where(user => user.UserRole == UserRole.Teacher),
                UserRole.Student => query.Where(user => user.UserRole == UserRole.Student),
                _ => query
            };
        }
        
        var totalCount = await query.CountAsync();
        
        query = sorting switch
        {
            UserSorting.NameAsc => query.OrderBy(user => user.FullName),
            UserSorting.NameDesc => query.OrderByDescending(user => user.FullName),
            UserSorting.RoleAsc => query.OrderBy(u => u.UserRole),
            UserSorting.RoleDesc => query.OrderByDescending(u => u.UserRole),
            null => query,
            _ => throw new ArgumentOutOfRangeException(nameof(sorting), sorting, $"Invalid sorting value: {sorting}")
        };

        if (pagination is not null)
            query = query
                .Skip(pagination.Offset)
                .Take(pagination.Limit);

        return new UserPagedList
        {
            Users = await query
                .ToListAsync(),
            TotalCount = totalCount
        };
    }

    public async Task<Result<User>> EditUserRole(Guid id, UserRole userRole)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
        user.UserRole = userRole;
        return user;
    }
}
