namespace SchoolManagementAPI.Models;

public class Mark
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public int SubjectId { get; set; }
    public string ExamType { get; set; } = string.Empty;
    public int Marks { get; set; }

}
