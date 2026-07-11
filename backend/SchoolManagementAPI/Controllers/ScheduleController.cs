using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ScheduleController : ControllerBase
{
    private readonly AppDbContext _db;
    public ScheduleController(AppDbContext db) { _db = db; }

    // Teacher assigned classes
    [HttpGet("teacher/{teacherId}/classes")]
    public async Task<IActionResult> GetTeacherClasses(int teacherId)
    {
        var classes = await _db.Classes
            .Where(c => c.TeacherId == teacherId)
            .ToListAsync();

        return Ok(classes);
    }

    // Class schedule with filters + view
    [HttpGet("class/{classId}")]
    public async Task<IActionResult> GetClassSchedule(
        int classId,
        [FromQuery] string? view,
        [FromQuery] DateTime? date,
        [FromQuery] string? subject,
        [FromQuery] string? teacher)
    {
        var query = _db.ClassSchedules
            .Where(s => s.ClassId == classId);

        if (!string.IsNullOrWhiteSpace(subject))
            query = query.Where(s => s.Subject.Contains(subject));

        if (!string.IsNullOrWhiteSpace(teacher))
            query = query.Where(s => s.TeacherName.Contains(teacher));

        if (date.HasValue)
        {
            var d = date.Value.Date;
            query = query.Where(s => s.StartTime.Date == d);
        }

        // simple view handling
        if (view == "weekly" && date.HasValue)
        {
            var start = date.Value.Date;
            var end = start.AddDays(7);
            query = query.Where(s => s.StartTime >= start && s.StartTime < end);
        }
        else if (view == "monthly" && date.HasValue)
        {
            var start = new DateTime(date.Value.Year, date.Value.Month, 1);
            var end = start.AddMonths(1);
            query = query.Where(s => s.StartTime >= start && s.StartTime < end);
        }

        var result = await query
            .OrderBy(s => s.StartTime)
            .ToListAsync();

        return Ok(result.Select(s => new
        {
            s.Id,
            s.Subject,
            s.TeacherName,
            s.Room,
            StartTime = s.StartTime.ToString("yyyy-MM-dd HH:mm"),
            EndTime   = s.EndTime.ToString("yyyy-MM-dd HH:mm")
        }));
    }
}
