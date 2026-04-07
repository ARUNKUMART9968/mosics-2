using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCrudAPI.Data;
using StudentCrudAPI.DTOs;
using StudentCrudAPI.Models;

namespace StudentCrudAPI.Controllers;

[ApiController]
[Route("api/marks")]
[Authorize]
public class MarksController : ControllerBase
{
    private readonly AppDbContext _db;

    public MarksController(AppDbContext db)
    {
        _db = db;
    }

    // ── POST /api/marks  (upsert — mirrors Prisma upsert) ─────────────
    [HttpPost]
    public async Task<IActionResult> SaveMarks([FromBody] SaveMarksRequest req)
    {
        var student = await _db.Students.FindAsync(req.StudentId);
        if (student is null)
            return NotFound(new MessageResponse("Student not found"));

        var total      = req.Subject1 + req.Subject2 + req.Subject3 + req.Subject4 + req.Subject5;
        var percentage = (total / 500.0) * 100.0;

        var existing = await _db.Marks.FirstOrDefaultAsync(m => m.StudentId == req.StudentId);

        if (existing is not null)
        {
            // Update
            existing.Subject1   = req.Subject1;
            existing.Subject2   = req.Subject2;
            existing.Subject3   = req.Subject3;
            existing.Subject4   = req.Subject4;
            existing.Subject5   = req.Subject5;
            existing.Total      = total;
            existing.Percentage = percentage;
            existing.UpdatedAt  = DateTime.UtcNow;
        }
        else
        {
            // Create
            var marks = new Marks
            {
                StudentId  = req.StudentId,
                Subject1   = req.Subject1,
                Subject2   = req.Subject2,
                Subject3   = req.Subject3,
                Subject4   = req.Subject4,
                Subject5   = req.Subject5,
                Total      = total,
                Percentage = percentage,
                CreatedAt  = DateTime.UtcNow,
                UpdatedAt  = DateTime.UtcNow
            };
            _db.Marks.Add(marks);
        }

        await _db.SaveChangesAsync();

        // Return the saved marks
        var saved = await _db.Marks.FirstAsync(m => m.StudentId == req.StudentId);
        return Ok(new MarksDto(
            saved.Id, saved.StudentId,
            saved.Subject1, saved.Subject2, saved.Subject3,
            saved.Subject4, saved.Subject5,
            saved.Total, saved.Percentage
        ));
    }

    // ── GET /api/marks/{studentId} ─────────────────────────────────────
    [HttpGet("{studentId:int}")]
    public async Task<IActionResult> GetMarks(int studentId)
    {
        var marks = await _db.Marks.FirstOrDefaultAsync(m => m.StudentId == studentId);
        if (marks is null)
            return NotFound(new MessageResponse("Marks not found"));

        return Ok(new MarksDto(
            marks.Id, marks.StudentId,
            marks.Subject1, marks.Subject2, marks.Subject3,
            marks.Subject4, marks.Subject5,
            marks.Total, marks.Percentage
        ));
    }
}
