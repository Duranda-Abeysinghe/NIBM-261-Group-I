namespace SchoolManagementAPI.Models;

public class Request
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public Student? Student { get; set; }

    // NEW: history entries for this request
    public List<RequestHistory> History { get; set; } = new List<RequestHistory>();
}
