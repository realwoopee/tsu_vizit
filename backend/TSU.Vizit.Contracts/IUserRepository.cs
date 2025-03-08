using FluentResults;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts;

public interface IUserRepository
{
    public Task<Result<User>> GetUserById(Guid id);
    public Task<Result<User>> GetUserByStudentCardId(string studentIdNumber);
    public Task<Result<User>> GetUserByEmail(string email);
    public Task<Result<User>> EditUser(Guid id, User newUser);
    public Task<Result<User>> CreateUser(User user);
}