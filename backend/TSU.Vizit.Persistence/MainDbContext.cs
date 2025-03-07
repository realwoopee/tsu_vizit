using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Persistence;

public class MainDbContext : DbContext
{
    public MainDbContext(DbContextOptions
        <MainDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // modelBuilder.Entity<PostLike>()
        //     .HasKey(pt => new { pt.PostId, pt.UserWhoLikedId });
    }
    
}