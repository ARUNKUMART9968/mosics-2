using Microsoft.EntityFrameworkCore;
using StudentCrudAPI.Models;

namespace StudentCrudAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    // ── Fix: use { get; set; } instead of => Set<>() ─────────────────
    public DbSet<Teacher> Teachers { get; set; } = null!;
    public DbSet<Student> Students { get; set; } = null!;
    public DbSet<Marks>   Marks    { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Teacher — unique email
        modelBuilder.Entity<Teacher>(e =>
        {
            e.HasKey(t => t.Id);
            e.HasIndex(t => t.Email).IsUnique();
            e.Property(t => t.Email).IsRequired().HasMaxLength(255);
            e.Property(t => t.Password).IsRequired();
            e.Property(t => t.ResetToken).HasMaxLength(255);
        });

        // Student — unique regNo
        modelBuilder.Entity<Student>(e =>
        {
            e.HasKey(s => s.Id);
            e.HasIndex(s => s.RegNo).IsUnique();
            e.Property(s => s.Name).IsRequired().HasMaxLength(255);
            e.Property(s => s.RegNo).IsRequired().HasMaxLength(100);
            e.Property(s => s.AttendancePercent).HasDefaultValue(0.0);
        });

        // Marks — one-to-one with Student
        modelBuilder.Entity<Marks>(e =>
        {
            e.HasKey(m => m.Id);
            e.HasIndex(m => m.StudentId).IsUnique();
            e.HasOne(m => m.Student)
             .WithOne(s => s.Marks)
             .HasForeignKey<Marks>(m => m.StudentId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}