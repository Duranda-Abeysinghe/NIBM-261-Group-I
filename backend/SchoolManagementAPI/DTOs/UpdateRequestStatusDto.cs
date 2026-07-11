namespace SchoolManagementAPI.DTOs;

public class UpdateRequestStatusDto
{
    public string Status { get; set; } = string.Empty;
    public string? Comment { get; set; }
}
