using System.IO;
using System.Threading.Tasks;
using SchoolManagementAPI.Data;

public static class ReportBuilder
{
    public static async Task<byte[]> BuildAttendanceReport(AppDbContext db)
    {
        var records = db.Attendance.ToList();

        using var ms = new MemoryStream();
        using var writer = new StreamWriter(ms);

        writer.WriteLine("Attendance Report");
        writer.WriteLine("------------------");

        foreach (var r in records)
            writer.WriteLine($"{r.StudentId} - {r.Status} - {r.Date}");

        writer.Flush();
        return ms.ToArray();
    }

    public static async Task<byte[]> BuildScheduleReport(AppDbContext db)
    {
        var schedules = db.ClassSchedules.ToList();

        using var ms = new MemoryStream();
        using var writer = new StreamWriter(ms);

        writer.WriteLine("Class Schedule Report");
        writer.WriteLine("---------------------");

        foreach (var s in schedules)
            writer.WriteLine($"{s.Subject} - {s.TeacherName} - {s.StartTime}");

        writer.Flush();
        return ms.ToArray();
    }

    public static async Task<byte[]> BuildStudentListReport(AppDbContext db)
    {
        var students = db.Students.ToList();

        using var ms = new MemoryStream();
        using var writer = new StreamWriter(ms);

        writer.WriteLine("Student List Report");
        writer.WriteLine("--------------------");

        foreach (var s in students)
            writer.WriteLine($"{s.Id} - {s.Name}");

        writer.Flush();
        return ms.ToArray();
    }
}
