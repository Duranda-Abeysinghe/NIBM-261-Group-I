using System;

namespace SchoolManagementAPI.Models;

public class RequestHistory
{
    public int Id { get; set; }
    public int RequestId { get; set; }
    public string OldStatus { get; set; } = string.Empty;
    public string NewStatus { get; set; } = string.Empty;
    public string? Comment { get; set; }
    public string Actor { get; set; } = string.Empty; // who changed the status (teacher/admin)
    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public Request? Request { get; set; }
}
