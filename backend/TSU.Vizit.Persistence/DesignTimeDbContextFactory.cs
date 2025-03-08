using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace TSU.Vizit.Persistence;

public class DesignTimeDbContextFactory 
    : IDesignTimeDbContextFactory<VizitDbContext>
{
    public VizitDbContext CreateDbContext(string[] args)
    {
        IConfiguration config = new ConfigurationBuilder()
            .SetBasePath(Path.Combine(Directory.GetCurrentDirectory(), "../TSU.Vizit.Application/"))
            .AddJsonFile("appsettings.json")
            .Build();
            
        var optionsBuilder = new DbContextOptionsBuilder<VizitDbContext>();
        optionsBuilder.UseSqlServer(config.GetConnectionString("DefaultConnection"));
        return new VizitDbContext(optionsBuilder.Options);
    }
}