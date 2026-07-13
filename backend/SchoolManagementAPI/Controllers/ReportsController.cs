using Microsoft.AspNetCore.Mvc;
using SchoolManagementAPI.Data;
using SchoolManagementAPI.Models;

namespace SchoolManagementAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportsController : ControllerBase
{
    private readonly AppDbContext _db;
    public ReportsController(AppDbContext db) { _db = db; }

    [HttpGet("generate/{type}")]
    public async Task<IActionResult> Generate(string type)
    {
        byte[] pdfBytes;

        switch (type.ToLower())
        {
            case "attendance":
                pdfBytes = await ReportBuilder.BuildAttendanceReport(_db);
                break;

            case "schedule":
                pdfBytes = await ReportBuilder.BuildScheduleReport(_db);
                break;

            case "students":
                pdfBytes = await ReportBuilder.BuildStudentListReport(_db);
                break;

            default:
                return BadRequest("Invalid report type");
        }

        // Log report generation
        _db.ReportLogs.Add(new ReportLog
        {
            ReportType = type,
            GeneratedAt = DateTime.Now,
            UserId = 1 // Replace with actual logged-in user
        });

        await _db.SaveChangesAsync();

        return File(pdfBytes, "application/pdf", $"{type}-report.pdf");
    }
}
