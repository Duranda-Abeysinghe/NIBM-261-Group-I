namespace SchoolManagementAPI.Models;

public class ReportLog
{
    public int Id { get; set; }
    public string ReportType { get; set; }
    public DateTime GeneratedAt { get; set; }
    public int UserId { get; set; }
}
