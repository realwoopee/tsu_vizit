using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Persistence;

public class DesignTimeDbContextFactory 
    : IDesignTimeDbContextFactory<VizitDbContext>
{
    public VizitDbContext CreateDbContext(string[] args)
    {
        IConfiguration config = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../TSU.Vizit.Application/"))
            .AddJsonFile("appsettings.json")
            .AddJsonFile("appsettings.local.json")
            .Build();
            
        var optionsBuilder = new DbContextOptionsBuilder<VizitDbContext>();
        optionsBuilder.UseNpgsql(config.GetConnectionString("DefaultConnection"), o => o.MapEnum<UserRole>());
        return new VizitDbContext(optionsBuilder.Options);
    }
}
