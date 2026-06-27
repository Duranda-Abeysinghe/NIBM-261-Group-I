namespace SchoolManagementAPI.Models;

public class Student
{
    public int Id { get; set; }
    public string AdmissionNo { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public DateTime? DateOfBirth { get; set; }
    public string Address { get; set; } = string.Empty;
    public string ParentName { get; set; } = string.Empty;
    public string ParentContact { get; set; } = string.Empty;
    public string Status { get; set; } = "Active";
    public int? ClassId { get; set; }
    public int? UserId { get; set; }
    public DateTime JoinDate { get; set; } = DateTime.Now;
    public int? AcademicYear { get; set; }
    public Class? Class { get; set; }
    public User? User { get; set; }
}
