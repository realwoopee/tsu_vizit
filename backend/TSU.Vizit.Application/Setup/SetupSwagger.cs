using Microsoft.OpenApi.Models;
using TSU.Vizit.Application.Infrastructure.Swagger;

namespace TSU.Vizit.Application.Setup;

public static class SetupSwagger
{
    public static void AddSwagger(WebApplicationBuilder builder)
    {
        var services = builder.Services;
        var configuration = builder.Configuration;

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo { Title = "TSU.Vizit", Version = "v1" });

            c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
                Name = "Authorization",
                In = ParameterLocation.Header,
                Type = SecuritySchemeType.ApiKey,
                Scheme = "Bearer"
            });

            c.AddOperationFilterInstance(new AuthOperationFilter());
        });
    }

    public static void UseSwagger(WebApplication app)
    {
        if (!app.Environment.IsDevelopment()) return;

        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/api/swagger/v1/swagger.json", "v1");
            options.RoutePrefix = "api";
        });
    }
}
