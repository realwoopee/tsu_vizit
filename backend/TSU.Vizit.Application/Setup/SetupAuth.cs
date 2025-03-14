using TSU.Vizit.Application.Infrastructure.Auth;

namespace TSU.Vizit.Application.Setup;

public static class SetupAuth
{
    public static void AddAuth(WebApplicationBuilder builder)
    {
        builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = VizitAuthenticationOptions.DefaultScheme;
                options.DefaultChallengeScheme = VizitAuthenticationOptions.DefaultScheme;
            })
            .AddScheme<VizitAuthenticationOptions, VizitAuthenticationHandler>(VizitAuthenticationOptions.DefaultScheme,
                options =>
                {
                    // options.TokenValidationParameters = new TokenValidationParameters
                    // {
                    //     ValidateIssuer = true,
                    //     ValidateAudience = true,
                    //     ValidateLifetime = true,
                    //     ValidateIssuerSigningKey = true,
                    //     ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    //     ValidAudience = builder.Configuration["Jwt:Audience"],
                    //     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
                    // };
                });

        builder.Services.AddAuthorization();
    }

    public static void UseAuth(WebApplication app)
    {
        app.UseAuthentication();

        app.UseAuthorization();
    }
}