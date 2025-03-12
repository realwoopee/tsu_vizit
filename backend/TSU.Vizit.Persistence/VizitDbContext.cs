using Microsoft.EntityFrameworkCore;
using Npgsql;
using TSU.Vizit.Domain;
using TSU.Vizit.Domain.Users;

namespace TSU.Vizit.Persistence;

public class VizitDbContext : DbContext
{
    // For runtime DI
    public VizitDbContext(DbContextOptions
        <VizitDbContext> options)
        : base(options)
    {
        NpgsqlConnection.GlobalTypeMapper.MapEnum<Roles>("roles");
    }
    
    // For design-time migrations
    // public VizitDbContext() {} 

    public virtual DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasPostgresEnum<Roles>();
        
        modelBuilder.Entity<User>()
            .Property(u => u.Role)
            .HasColumnType("roles");
        
        modelBuilder.Entity<User>()
            .HasIndex(e => e.Email)
            .IsUnique();
        
        modelBuilder.Entity<User>()
            .HasIndex(e => e.StudentIdNumber)
            .IsUnique();
        
        // modelBuilder.Entity<PostLike>()
        //     .HasKey(pt => new { pt.PostId, pt.UserWhoLikedId });
    }
    
}
