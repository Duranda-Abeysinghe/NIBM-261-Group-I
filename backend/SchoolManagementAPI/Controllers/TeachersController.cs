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
public class TeachersController : ControllerBase
{
    private readonly AppDbContext _db;
    public TeachersController(AppDbContext db) { _db = db; }

    // ─────────────────────────────────────────
    // GET api/teachers
    // ─────────────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? status,
        [FromQuery] string? subject)
    {
        var q = _db.Teachers.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            q = q.Where(t => t.FullName.Contains(search) ||
                              t.Email.Contains(search) ||
                              (t.Subject != null && t.Subject.Contains(search)));

        if (!string.IsNullOrWhiteSpace(status) && status != "All")
            q = q.Where(t => t.Status == status);

        if (!string.IsNullOrWhiteSpace(subject))
            q = q.Where(t => t.Subject == subject);

        var teachers = await q
            .OrderBy(t => t.FullName)
            .Select(t => new
            {
                t.Id, t.FullName, t.Email, t.Phone,
                t.Gender, t.Subject, t.Address, t.Status, t.UserId
            })
            .ToListAsync();

        return Ok(teachers);
    }

    // ─────────────────────────────────────────
    // GET api/teachers/{id}
    // ─────────────────────────────────────────
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var t = await _db.Teachers.FindAsync(id);
        if (t == null)
            return NotFound(new ResponseDto { Success = false, Message = "Not found" });
        return Ok(t);
    }

    // ─────────────────────────────────────────
    // GET api/teachers/count
    // ─────────────────────────────────────────
    [HttpGet("count")]
    public async Task<IActionResult> GetCount()
        => Ok(await _db.Teachers.CountAsync());

    // ─────────────────────────────────────────
    // GET api/teachers/subjects   (distinct list for filter dropdown)
    // ─────────────────────────────────────────
    [HttpGet("subjects")]
    public async Task<IActionResult> GetSubjects()
    {
        var subjects = await _db.Teachers
            .Where(t => t.Subject != null)
            .Select(t => t.Subject!)
            .Distinct()
            .OrderBy(s => s)
            .ToListAsync();
        return Ok(subjects);
    }

    // ─────────────────────────────────────────
    // POST api/teachers/with-account
    // Creates User login row + Teacher row in one transaction
    // ─────────────────────────────────────────
    [HttpPost("with-account")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateWithAccount([FromBody] TeacherWithAccountDto dto)
    {
        using var tx = await _db.Database.BeginTransactionAsync();
        try
        {
            // Check email unique
            if (await _db.Users.AnyAsync(u => u.Email == dto.Email))
                return BadRequest(new ResponseDto
                {
                    Success = false,
                    Message = "Email already exists"
                });

            // 1. Save to Users table (hashed password)
            var user = new User
            {
                Name     = dto.FullName,
                Email    = dto.Email,
                Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                Role     = "Teacher"
            };
            _db.Users.Add(user);
            await _db.SaveChangesAsync();   // get user.Id

            // 2. Save to Teachers table, link UserId
            var teacher = new Teacher
            {
                FullName = dto.FullName,
                Email    = dto.Email,
                Phone    = dto.Phone,
                Gender   = dto.Gender,
                Subject  = dto.Subject,
                Address  = dto.Address,
                Status   = dto.Status,
                UserId   = user.Id          // ← links teacher to login account
            };
            _db.Teachers.Add(teacher);
            await _db.SaveChangesAsync();

            await tx.CommitAsync();

            return Ok(new ResponseDto
            {
                Success = true,
                Message = "Teacher account created successfully",
                Data    = new
                {
                    teacher.Id,
                    teacher.FullName,
                    teacher.Email,
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

    // ─────────────────────────────────────────
    // PUT api/teachers/{id}
    // ─────────────────────────────────────────
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update(int id, [FromBody] TeacherUpdateDto dto)
    {
        var teacher = await _db.Teachers.FindAsync(id);
        if (teacher == null)
            return NotFound(new ResponseDto { Success = false, Message = "Not found" });

        // Update teacher record
        teacher.FullName = dto.FullName;
        teacher.Email    = dto.Email;
        teacher.Phone    = dto.Phone;
        teacher.Gender   = dto.Gender;
        teacher.Subject  = dto.Subject;
        teacher.Address  = dto.Address;
        teacher.Status   = dto.Status;

        // Keep Users table name/email in sync
        if (teacher.UserId.HasValue)
        {
            var user = await _db.Users.FindAsync(teacher.UserId.Value);
            if (user != null)
            {
                user.Name  = dto.FullName;
                user.Email = dto.Email;
            }
        }

        await _db.SaveChangesAsync();
        return Ok(new ResponseDto { Success = true, Message = "Updated", Data = teacher });
    }

    // ─────────────────────────────────────────
    // DELETE api/teachers/{id}
    // Removes teacher + their login account
    // ─────────────────────────────────────────
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var teacher = await _db.Teachers.FindAsync(id);
        if (teacher == null)
            return NotFound(new ResponseDto { Success = false, Message = "Not found" });

        // Remove login account too
        if (teacher.UserId.HasValue)
        {
            var user = await _db.Users.FindAsync(teacher.UserId.Value);
            if (user != null) _db.Users.Remove(user);
        }

        _db.Teachers.Remove(teacher);
        await _db.SaveChangesAsync();
        return Ok(new ResponseDto { Success = true, Message = "Deleted" });
    }
}
