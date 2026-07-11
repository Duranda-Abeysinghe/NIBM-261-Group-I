using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Student> Students { get; set; }
    public DbSet<Teacher> Teachers { get; set; }
    public DbSet<Class> Classes { get; set; }
    public DbSet<Subject> Subjects { get; set; }
    public DbSet<Attendance> Attendance { get; set; }
    public DbSet<Mark> Marks { get; set; }
    public DbSet<Schedule> Schedules { get; set; }
    public DbSet<Request> Requests { get; set; }
    public DbSet<Announcement> Announcements { get; set; }
    public DbSet<ClassSchedule> ClassSchedules { get; set; }
    public DbSet<Class> Classes { get; set; }

    // NEW DbSets
    public DbSet<RequestHistory> RequestHistories { get; set; }
    public DbSet<Notification> Notifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Student>()
            .HasOne(s => s.Class)
            .WithMany(c => c.Students)
            .HasForeignKey(s => s.ClassId)
            .OnDelete(DeleteBehavior.SetNull);

        modelBuilder.Entity<Class>()
            .HasOne(c => c.Teacher)
            .WithMany()
            .HasForeignKey(c => c.TeacherId)
            .OnDelete(DeleteBehavior.SetNull);

        // RequestHistory -> Request relationship
        modelBuilder.Entity<RequestHistory>()
            .HasOne(h => h.Request)
            .WithMany(r => r.History)
            .HasForeignKey(h => h.RequestId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
