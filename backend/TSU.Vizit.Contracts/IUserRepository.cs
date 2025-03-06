using System.Net.Sockets;
using FluentResults;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts;

public interface IUserRepository
{
    public Task Add();
    public Task<User> GetUserById(Guid id);
    public Task<User> GetUserByStudentCardId(string studentCardId);
    public Task<User> GetUserByEmail(string email);
    public Task EditUser(Guid id, User newUser);
}