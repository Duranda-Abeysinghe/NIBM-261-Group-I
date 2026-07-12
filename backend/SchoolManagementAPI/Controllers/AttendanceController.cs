using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.DTOs;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AttendanceController : ControllerBase
{
    private readonly AppDbContext _db;
    public AttendanceController(AppDbContext db) { _db = db; }
    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _db.Attendance
            .Include(a => a.Student)
            .ToListAsync());
    [HttpGet("student/{studentId}")]
    public async Task<IActionResult> GetByStudent(int studentId)
        => Ok(await _db.Attendance
            .Where(a => a.StudentId == studentId)
            .ToListAsync());

    [HttpGet("teacher/{teacherId}/classes")]
    public async Task<IActionResult> GetTeacherClasses(int teacherId)
    {
        var classes = await _db.Classes
            .Where(c => c.TeacherId == teacherId)
            .ToListAsync();

        return Ok(classes);
    }

    [HttpGet("class/{classId}/students")]
    public async Task<IActionResult> GetClassStudents(int classId)
    {
        var students = await _db.Students
            .Where(s => s.ClassId == classId)
            .ToListAsync();

        return Ok(students);
    }
    [HttpPost("save-dict")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> SaveAttendanceDict([FromBody] AttendanceSaveRequest req)
    {
        foreach (var record in req.Records)
        {
            int studentId = int.Parse(record.Key);
            string status = record.Value;

            var existing = await _db.Attendance
                .FirstOrDefaultAsync(a =>
                    a.StudentId == studentId &&
                    a.Date.Date == DateTime.Now.Date &&
                    a.ClassId == req.ClassId);

            if (existing != null)
            {
                existing.Status = status;
            }
            else
            {
                _db.Attendance.Add(new Attendance
                {
                    StudentId = studentId,
                    ClassId = req.ClassId,
                    TeacherId = req.TeacherId,
                    Status = status,
                    Date = DateTime.Now
                });
            }
        }

        await _db.SaveChangesAsync();
        return Ok(new ResponseDto { Success = true, Message = "Attendance saved" });
    }

    [HttpPost("save-list")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<IActionResult> SaveAttendanceList(List<Attendance> records)
    {
        foreach (var record in records)
        {
            var existing = await _db.Attendance
                .FirstOrDefaultAsync(a =>
                    a.StudentId == record.StudentId &&
                    a.Date.Date == record.Date.Date &&
                    a.ClassId == record.ClassId);

            if (existing != null)
                existing.Status = record.Status;
            else
                _db.Attendance.Add(record);
        }

        await _db.SaveChangesAsync();
        return Ok(new ResponseDto { Success = true, Message = "Attendance saved" });
    }
}

public class AttendanceSaveRequest
{
    public int ClassId { get; set; }
    public int TeacherId { get; set; }
    public Dictionary<string, string> Records { get; set; }
}
