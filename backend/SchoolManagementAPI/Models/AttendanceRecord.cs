public class AttendanceRecord
{
    public int Id { get; set; }
    public int ClassId { get; set; }
    public int StudentId { get; set; }
    public int TeacherId { get; set; }
    public string Status { get; set; }   // Present / Absent
    public DateTime Date { get; set; }
}
