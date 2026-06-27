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
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _db;
    public StudentsController(AppDbContext db) { _db = db; }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] int? classId,
        [FromQuery] int? academicYear)
    {
        var q = _db.Students
            .Include(s => s.Class)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(s => s.FullName.Contains(search) ||
                             s.Email.Contains(search) ||
                             s.AdmissionNo.Contains(search));

        if (!string.IsNullOrWhiteSpace(status) && status != "All")
            q = q.Where(s => s.Status == status);

        if (classId.HasValue)
            q = q.Where(s => s.ClassId == classId.Value);

        if (academicYear.HasValue)
            q = q.Where(s => s.AcademicYear == academicYear.Value);

        var students = await q
            .OrderBy(s => s.FullName)
            .Select(s => new
            {
                s.Id,
                s.AdmissionNo,
                s.FullName,
                s.Email,
                s.Phone,
                s.Gender,
                s.DateOfBirth,
                s.Address,
                s.ParentName,
                s.ParentContact,
                s.Status,
                s.ClassId,
                ClassName = s.Class != null ? s.Class.ClassName + " " + s.Class.Section : null,
                s.UserId,
                s.JoinDate,
                s.AcademicYear
            })
            .ToListAsync();

        return Ok(students);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var student = await _db.Students
            .Include(s => s.Class)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student == null)
            return NotFound(new ResponseDto { Success = false, Message = "Not found" });

        return Ok(new
        {
            student.Id,
            student.AdmissionNo,
            student.FullName,
            student.Email,
            student.Phone,
            student.Gender,
            student.DateOfBirth,
            student.Address,
            student.ParentName,
            student.ParentContact,
            student.Status,
            student.ClassId,
            ClassName = student.Class != null ? student.Class.ClassName + " " + student.Class.Section : null,
            student.UserId,
            student.JoinDate,
            student.AcademicYear
        });
    }

    [HttpGet("count")]
    public async Task<IActionResult> GetCount()
        => Ok(await _db.Students.CountAsync());

    [HttpGet("academic-years")]
    public async Task<IActionResult> GetAcademicYears()
    {
        var years = await _db.Students
            .Where(s => s.AcademicYear.HasValue)
            .Select(s => s.AcademicYear!.Value)
            .Distinct()
            .OrderByDescending(y => y)
            .ToListAsync();

        return Ok(years);
    }

    [HttpPost("with-account")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateWithAccount([FromBody] StudentWithAccountDto dto)
    {
        using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new ResponseDto { Success = false, Message = "Email already exists" });

            var user = new User
            {
                Name = dto.FullName,
                Email = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role = "Student"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            var student = new Student
            {
                AdmissionNo = await GenerateAdmissionNo(),
                FullName = dto.FullName,
                Email = dto.Email,
                Phone = dto.Phone ?? "",
                Gender = dto.Gender ?? "",
                DateOfBirth = dto.DateOfBirth,
                Address = dto.Address ?? "",
                ParentName = dto.ParentName ?? "",
                ParentContact = dto.ParentContact ?? "",
                ClassId = dto.ClassId,
                AcademicYear = dto.AcademicYear,
                UserId = user.Id,
                Status = "Active"
            };

            _db.Students.Add(student);
            await _db.SaveChangesAsync();
            await tx.CommitAsync();

            return Ok(new ResponseDto
            {
                Success = true,
                Message = "Student account created successfully",
                Data = new
                {
                    student.Id,
                    student.AdmissionNo,
                    student.FullName,
                    student.Email,
                    UserId = user.Id
                }
            });
        }
        catch (Exception ex)
        {
            await tx.RollbackAsync();
            return StatusCode(500, new ResponseDto { Success = false, Message = ex.Message });
        }
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] StudentUpdateDto dto)
    {
        var student = await _db.Students.FindAsync(id);
        if (student == null)
            return NotFound(new ResponseDto { Success = false, Message = "Not found" });

        student.FullName = dto.FullName;
        student.Email = dto.Email;
        student.Phone = dto.Phone ?? "";
        student.Gender = dto.Gender ?? "";
        student.Address = dto.Address ?? "";
        student.ParentName = dto.ParentName ?? "";
        student.ParentContact = dto.ParentContact ?? "";
        student.Status = dto.Status;
        student.ClassId = dto.ClassId;
        student.AcademicYear = dto.AcademicYear;

        if (student.UserId.HasValue)
        {
            var user = await _db.Users.FindAsync(student.UserId.Value);
            if (user != null)
            {
                user.Name = dto.FullName;
                user.Email = dto.Email;
            }
        }

        await _db.SaveChangesAsync();
        return Ok(new ResponseDto { Success = true, Message = "Updated", Data = student });
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var student = await _db.Students.FindAsync(id);
        if (student == null)
            return NotFound(new ResponseDto { Success = false, Message = "Not found" });

        if (student.UserId.HasValue)
        {
            var user = await _db.Users.FindAsync(student.UserId.Value);
            if (user != null) _db.Users.Remove(user);
        }

        _db.Students.Remove(student);
        await _db.SaveChangesAsync();
        return Ok(new ResponseDto { Success = true, Message = "Deleted" });
    }

    private async Task<string> GenerateAdmissionNo()
    {
        var nextId = await _db.Students.AnyAsync()
            ? await _db.Students.MaxAsync(s => s.Id) + 1
            : 1;

        return $"ADM{DateTime.Now.Year}{nextId:D4}";
    }
}
