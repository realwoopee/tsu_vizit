using FluentResults;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Contracts.Users;

public interface IUserRepository
{
    public Task<Result<Domain.Users.User>> GetUserById(Guid id);
    public Task<Result<Domain.Users.User>> GetUserByStudentCardId(string studentIdNumber);
    public Task<Result<Domain.Users.User>> GetUserByEmail(string email);
    public Task<Result<Domain.Users.User>> EditUser(Guid id, Domain.Users.User newUser);
    public Task<Result<Domain.Users.User>> CreateUser(Domain.Users.User user);
    public Task<Result<UserPagedList>> GetAllUsers(UserListFilter filter, UserSorting? sorting, PaginationModel? pagination);
    public Task<Result<Domain.Users.User>> EditUserRole(Guid id, UserRole userRole);
}
