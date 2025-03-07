using Microsoft.EntityFrameworkCore;
using TSU.Vizit.Domain;

namespace TSU.Vizit.Persistence;

public class VizitDbContext : DbContext
{
    public VizitDbContext(DbContextOptions
        <VizitDbContext> options)
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