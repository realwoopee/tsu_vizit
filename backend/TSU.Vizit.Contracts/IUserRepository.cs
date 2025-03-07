using FluentResults;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts;

public interface IUserRepository
{
    public Task<User?> GetUserById(Guid id);
    public Task<User?> GetUserByStudentCardId(string studentCardId);
    public Task<User?> GetUserByEmail(string email);
    public Task EditUser(Guid id, User newUser);
    public Task<Result<User?>> RegisterUser(User user);
}