namespace SchoolManagementAPI.Models;

public class ClassSchedule
{
    public int Id { get; set; }
    public int ClassId { get; set; }
    public string Subject { get; set; } = string.Empty;
    public string TeacherName { get; set; } = string.Empty;
    public string Room { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
}
