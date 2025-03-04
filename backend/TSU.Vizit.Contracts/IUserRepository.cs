using System.Net.Sockets;

namespace TSU.Vizit.Contracts;

public interface IUserRepository
{
    public Task Add();
}