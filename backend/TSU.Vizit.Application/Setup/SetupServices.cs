using Microsoft.AspNetCore.Identity;
using TSU.Vizit.Application.Features.Users;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Contracts;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Application.Setup;

public static class SetupServices
{
    public static void AddServices(
        IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment environment
    )
    {
        services.AddScoped<PasswordHasher<User>>(provider => new PasswordHasher<User>());
        services.AddScoped<TokenService>();
        services.AddScoped<UserService>();
        services.AddScoped<UserAccessor>();
        services.AddScoped<IUserRepository>(provider => new object() as IUserRepository);
    }
}