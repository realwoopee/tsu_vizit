using FluentResults;
using TSU.Vizit.Contracts.Utils;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Contracts.Users;

public interface IUserRepository
{
    public Task<Result<User>> GetUserById(Guid id);
    public Task<Result<User>> GetUserByStudentCardId(string studentIdNumber);
    public Task<Result<User>> GetUserByEmail(string email);
    public Task<Result> VerifyUserPassword(User user, string password);
    public Task<Result<User>> EditUser(Guid id, User newUser);
    public Task<Result<User>> CreateUser(User user);

    public Task<Result<UserPagedList>> GetAllUsers(UserListFilter filter, UserSorting? sorting,
        PaginationModel? pagination);

    public Task<Result<User>> EditUserRole(Guid id, UserRole userRole);
}
