using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCrudAPI.Data;
using StudentCrudAPI.DTOs;
using StudentCrudAPI.Models;

namespace StudentCrudAPI.Controllers;

[ApiController]
[Route("api/students")]
[Authorize]
public class StudentsController : ControllerBase
{
    private readonly AppDbContext _db;

    public StudentsController(AppDbContext db)
    {
        _db = db;
    }

    // ── Helper: map Student → StudentResponse DTO ─────────────────────
    private static StudentResponse ToDto(Student s) => new(
        s.Id,
        s.Name,
        s.RegNo,
        s.AttendancePercent,
        s.CreatedAt,
        s.UpdatedAt,
        s.Marks is null ? null : new MarksDto(
            s.Marks.Id,
            s.Marks.StudentId,
            s.Marks.Subject1,
            s.Marks.Subject2,
            s.Marks.Subject3,
            s.Marks.Subject4,
            s.Marks.Subject5,
            s.Marks.Total,
            s.Marks.Percentage
        )
    );

    // ── GET /api/students ──────────────────────────────────────────────
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var students = await _db.Students
            .Include(s => s.Marks)
            .OrderBy(s => s.Name)
            .ToListAsync();

        return Ok(students.Select(ToDto));
    }

    // ── GET /api/students/ranking ──────────────────────────────────────
    [HttpGet("ranking")]
    public async Task<IActionResult> GetRanking()
    {
        var students = await _db.Students
            .Include(s => s.Marks)
            .Where(s => s.Marks != null)
            .OrderByDescending(s => s.Marks!.Total)
            .ToListAsync();

        var ranked = students.Select((s, index) => new RankedStudentResponse(
            index + 1,
            s.Id,
            s.Name,
            s.RegNo,
            s.AttendancePercent,
            s.CreatedAt,
            s.UpdatedAt,
            new MarksDto(
                s.Marks!.Id,
                s.Marks.StudentId,
                s.Marks.Subject1,
                s.Marks.Subject2,
                s.Marks.Subject3,
                s.Marks.Subject4,
                s.Marks.Subject5,
                s.Marks.Total,
                s.Marks.Percentage
            )
        ));

        return Ok(ranked);
    }

    // ── GET /api/students/{id} ─────────────────────────────────────────
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var student = await _db.Students
            .Include(s => s.Marks)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student is null)
            return NotFound(new MessageResponse("Student not found"));

        return Ok(ToDto(student));
    }

    // ── POST /api/students ─────────────────────────────────────────────
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateStudentRequest req)
    {
        if (string.IsNullOrWhiteSpace(req.Name) || string.IsNullOrWhiteSpace(req.RegNo))
            return BadRequest(new MessageResponse("Name and RegNo are required"));

        if (await _db.Students.AnyAsync(s => s.RegNo == req.RegNo))
            return Conflict(new MessageResponse("Register number already exists"));

        var student = new Student
        {
            Name              = req.Name,
            RegNo             = req.RegNo,
            AttendancePercent = req.AttendancePercent,
            CreatedAt         = DateTime.UtcNow,
            UpdatedAt         = DateTime.UtcNow
        };

        _db.Students.Add(student);
        await _db.SaveChangesAsync();

        return StatusCode(201, ToDto(student));
    }

    // ── PUT /api/students/{id} ─────────────────────────────────────────
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateStudentRequest req)
    {
        var student = await _db.Students
            .Include(s => s.Marks)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (student is null)
            return NotFound(new MessageResponse("Student not found"));

        // Check regNo uniqueness (exclude self)
        if (await _db.Students.AnyAsync(s => s.RegNo == req.RegNo && s.Id != id))
            return Conflict(new MessageResponse("Register number already in use"));

        student.Name              = req.Name;
        student.RegNo             = req.RegNo;
        student.AttendancePercent = req.AttendancePercent;
        student.UpdatedAt         = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(ToDto(student));
    }

    // ── DELETE /api/students/{id} ──────────────────────────────────────
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var student = await _db.Students.FindAsync(id);
        if (student is null)
            return NotFound(new MessageResponse("Student not found"));

        _db.Students.Remove(student);
        await _db.SaveChangesAsync();

        return Ok(new MessageResponse("Student deleted successfully"));
    }
}
