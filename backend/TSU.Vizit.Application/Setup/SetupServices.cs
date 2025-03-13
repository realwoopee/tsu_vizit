using Microsoft.AspNetCore.Identity;
using TSU.Vizit.Application.Features.AbsenceRequests;
using TSU.Vizit.Application.Features.Auth;
using TSU.Vizit.Application.Features.Users;
using TSU.Vizit.Application.Infrastructure.Auth;
using TSU.Vizit.Application.Settings;
using TSU.Vizit.Contracts;
using TSU.Vizit.Contracts.AbsenceRequests;
using TSU.Vizit.Contracts.Documents;
using TSU.Vizit.Contracts.Users;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;
using TSU.Vizit.Persistence;

namespace TSU.Vizit.Application.Setup;

public static class SetupServices
{
    public static void AddServices(
        IServiceCollection services,
        IConfiguration configuration,
        IWebHostEnvironment environment
    )
    {
        services.AddSingleton<ISessionRepository, SessionRepository>();
        services.AddScoped<PasswordHasher<User>>(provider => new PasswordHasher<User>());
        services.AddScoped<TokenService>();
        services.AddScoped<AuthService>();
        services.AddScoped<UserService>();
        services.AddScoped<AbsenceRequestService>();
        services.AddScoped<UserAccessor>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IAbsenceRequestRepository, AbsenceRequestRepository>();
        services.AddScoped<IDocumentRepository, DocumentRepository>();

        AddOptions(services, configuration);
    }

    public static void AddOptions(IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<JwtSettings>(configuration.GetSection("JwtSettings"));
    }
}
