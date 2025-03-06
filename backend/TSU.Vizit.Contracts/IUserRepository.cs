using System.Net.Sockets;
using FluentResults;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Contracts;

public interface IUserRepository
{
    public Task Add();
    public Task<Result<User>> GetUserById(Guid id);
}