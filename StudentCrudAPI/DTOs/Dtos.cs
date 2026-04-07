namespace StudentCrudAPI.DTOs;

// ── AUTH DTOs ─────────────────────────────────────────────────────────────

public record LoginRequest(string Email, string Password);

public record RegisterRequest(string Email, string Password);

public record ForgotPasswordRequest(string Email);

public record ResetPasswordRequest(string Token, string NewPassword);

public record AuthResponse(string Token);

public record MessageResponse(string Message);

// ── STUDENT DTOs ──────────────────────────────────────────────────────────

public record CreateStudentRequest(
    string Name,
    string RegNo,
    double AttendancePercent = 0
);

public record UpdateStudentRequest(
    string Name,
    string RegNo,
    double AttendancePercent
);

public record MarksDto(
    int Id,
    int StudentId,
    double Subject1,
    double Subject2,
    double Subject3,
    double Subject4,
    double Subject5,
    double Total,
    double Percentage
);

public record StudentResponse(
    int Id,
    string Name,
    string RegNo,
    double AttendancePercent,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    MarksDto? Marks
);

public record RankedStudentResponse(
    int Rank,
    int Id,
    string Name,
    string RegNo,
    double AttendancePercent,
    DateTime CreatedAt,
    DateTime UpdatedAt,
    MarksDto? Marks
);

// ── MARKS DTOs ────────────────────────────────────────────────────────────

public record SaveMarksRequest(
    int StudentId,
    double Subject1,
    double Subject2,
    double Subject3,
    double Subject4,
    double Subject5
);
