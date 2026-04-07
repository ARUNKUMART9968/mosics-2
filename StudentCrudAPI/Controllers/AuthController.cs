using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentCrudAPI.Data;
using StudentCrudAPI.DTOs;
using StudentCrudAPI.Models;
using StudentCrudAPI.Services;

namespace StudentCrudAPI.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext  _db;
    private readonly IJwtService   _jwt;
    private readonly IEmailService _email;
    private readonly IConfiguration _config;

    public AuthController(
        AppDbContext db,
        IJwtService jwt,
        IEmailService email,
        IConfiguration config)
    {
        _db     = db;
        _jwt    = jwt;
        _email  = email;
        _config = config;
    }

    // ── POST /api/auth/register ────────────────────────────────────────
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest req)
    {
        if (await _db.Teachers.AnyAsync(t => t.Email == req.Email))
            return Conflict(new MessageResponse("Email already registered"));

        var teacher = new Teacher
        {
            Email    = req.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(req.Password)
        };

        _db.Teachers.Add(teacher);
        await _db.SaveChangesAsync();

        return StatusCode(201, new { message = "Teacher registered", id = teacher.Id });
    }

    // ── POST /api/auth/login ───────────────────────────────────────────
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest req)
    {
        var teacher = await _db.Teachers.FirstOrDefaultAsync(t => t.Email == req.Email);
        if (teacher is null)
            return NotFound(new MessageResponse("Teacher not found"));

        if (!BCrypt.Net.BCrypt.Verify(req.Password, teacher.Password))
            return Unauthorized(new MessageResponse("Invalid credentials"));

        var token = _jwt.GenerateToken(teacher.Id, teacher.Email);
        return Ok(new AuthResponse(token));
    }

    // ── POST /api/auth/forgot-password ────────────────────────────────
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordRequest req)
    {
        var teacher = await _db.Teachers.FirstOrDefaultAsync(t => t.Email == req.Email);
        if (teacher is null)
            return NotFound(new MessageResponse("Email not found"));

        // Generate a secure random token
        var resetToken  = Convert.ToHexString(RandomNumberGenerator.GetBytes(32)).ToLower();
        var resetExpiry = DateTime.UtcNow.AddHours(1);

        teacher.ResetToken       = resetToken;
        teacher.ResetTokenExpiry = resetExpiry;
        await _db.SaveChangesAsync();

        var frontendUrl = _config["Frontend:Url"] ?? "http://localhost:3000";
        var resetLink   = $"{frontendUrl}/reset-password/{resetToken}";

        try
        {
            await _email.SendPasswordResetAsync(req.Email, resetLink);
            return Ok(new MessageResponse("Reset link sent to email"));
        }
        catch
        {
            return StatusCode(500, new MessageResponse("Failed to send email"));
        }
    }

    // ── POST /api/auth/reset-password ─────────────────────────────────
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordRequest req)
    {
        var teacher = await _db.Teachers.FirstOrDefaultAsync(t =>
            t.ResetToken == req.Token &&
            t.ResetTokenExpiry > DateTime.UtcNow);

        if (teacher is null)
            return BadRequest(new MessageResponse("Invalid or expired token"));

        teacher.Password         = BCrypt.Net.BCrypt.HashPassword(req.NewPassword);
        teacher.ResetToken       = null;
        teacher.ResetTokenExpiry = null;
        await _db.SaveChangesAsync();

        return Ok(new MessageResponse("Password reset successful"));
    }
}
