using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Persistence;

public class VizitDbContext : DbContext
{
    // For runtime DI
    public VizitDbContext(DbContextOptions
        <VizitDbContext> options)
        : base(options)
    {
    }
    
    // For design-time migrations
    // public VizitDbContext() {} 

    public virtual DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
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