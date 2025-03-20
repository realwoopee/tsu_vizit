using FluentResults;
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
        NpgsqlConnection.GlobalTypeMapper.MapEnum<UserRole>();
        NpgsqlConnection.GlobalTypeMapper.MapEnum<AbsenceReason>();
        NpgsqlConnection.GlobalTypeMapper.MapEnum<AbsenceRequestResult>();
    }

    // For design-time migrations
    // public VizitDbContext() {} 

    public virtual DbSet<User> Users { get; set; }
    public virtual DbSet<AbsenceRequest> AbsenceRequest { get; set; }
    public virtual DbSet<Document> Document { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.HasPostgresEnum<UserRole>();
        modelBuilder.HasPostgresEnum<AbsenceReason>();
        modelBuilder.HasPostgresEnum<AbsenceRequestResult>();

        modelBuilder.Entity<User>()
            .HasIndex(e => e.Email)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasIndex(e => e.StudentIdNumber)
            .IsUnique();

        modelBuilder.Entity<AbsenceRequest>()
            .HasKey(ar => new { ar.Id });
    }
}
