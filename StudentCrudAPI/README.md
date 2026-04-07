# StudentCRUD — .NET 8 / EF Core Backend

Drop-in replacement for the Node.js/Prisma backend. Exposes **the exact same REST API**
so the existing React frontend works without any changes.

---

## Tech Stack

| Layer        | Technology                              |
|-------------|------------------------------------------|
| Framework   | ASP.NET Core 8 Web API                   |
| ORM         | Entity Framework Core 8 (Code-First)     |
| Database    | SQL Server (same DB as the Node version) |
| Auth        | JWT Bearer (same secret, same structure) |
| Email       | MailKit (SMTP / Gmail)                   |
| Docs        | Swagger / OpenAPI                        |
| Passwords   | BCrypt.Net-Next                          |

---

## Project Structure

```
StudentCrudAPI/
├── Controllers/
│   ├── AuthController.cs        # POST /api/auth/*
│   ├── StudentsController.cs    # GET/POST/PUT/DELETE /api/students
│   └── MarksController.cs       # GET/POST /api/marks
├── Data/
│   └── AppDbContext.cs          # EF Core DbContext
├── DTOs/
│   └── Dtos.cs                  # All request/response records
├── Migrations/
│   ├── 20240101000000_InitialCreate.cs
│   └── AppDbContextModelSnapshot.cs
├── Models/
│   ├── Teacher.cs
│   ├── Student.cs
│   └── Marks.cs
├── Properties/
│   └── launchSettings.json      # Runs on http://localhost:5000
├── Services/
│   ├── JwtService.cs
│   └── EmailService.cs
├── appsettings.json
├── appsettings.Development.json
└── Program.cs
```

---

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8)
- SQL Server 2019+ (LocalDB, Express, or full)
- A Gmail account with an [App Password](https://myaccount.google.com/apppasswords) for email

---

## Quick Start

### 1. Clone / copy the project

```bash
cd StudentCrudAPI
```

### 2. Configure settings

Edit **`appsettings.Development.json`** (never commit real secrets):

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost,1433;Database=StudentDB;Integrated Security=True;TrustServerCertificate=True"
  },
  "Jwt": {
    "Secret": "your_super_secret_jwt_key",
    "ExpiresIn": "1h"
  },
  "Email": {
    "User": "your_email@gmail.com",
    "Pass": "your_gmail_app_password"
  },
  "Frontend": {
    "Url": "http://localhost:5173"
  }
}
```

> **Tip — using the same SQL Server as the Node version?**  
> Just point the connection string at the same `StudentDB` instance.  
> The migration will skip tables that already exist if you run `db.Database.Migrate()`.  
> Or drop the DB and let EF recreate it cleanly.

### 3. Restore packages

```bash
dotnet restore
```

### 4. Apply migrations

The API auto-migrates on startup in Development mode (`Program.cs` calls `db.Database.Migrate()`).
You can also run manually:

```bash
dotnet ef database update
```

Or regenerate migrations from scratch:

```bash
dotnet ef migrations add InitialCreate
dotnet ef database update
```

### 5. Run

```bash
dotnet run
```

The API starts on **http://localhost:5000** — the same port as the Node version.

Open Swagger UI: **http://localhost:5000/swagger**

---

## API Reference

All protected routes require:

```
Authorization: Bearer <jwt_token>
```

### Auth

| Method | Route                        | Body                                  | Auth |
|--------|------------------------------|---------------------------------------|------|
| POST   | `/api/auth/register`         | `{ email, password }`                 | ❌   |
| POST   | `/api/auth/login`            | `{ email, password }`                 | ❌   |
| POST   | `/api/auth/forgot-password`  | `{ email }`                           | ❌   |
| POST   | `/api/auth/reset-password`   | `{ token, newPassword }`              | ❌   |

### Students

| Method | Route                    | Body                                        | Auth |
|--------|--------------------------|---------------------------------------------|------|
| GET    | `/api/students`          | —                                           | ✅   |
| GET    | `/api/students/ranking`  | —                                           | ✅   |
| GET    | `/api/students/{id}`     | —                                           | ✅   |
| POST   | `/api/students`          | `{ name, regNo, attendancePercent }`        | ✅   |
| PUT    | `/api/students/{id}`     | `{ name, regNo, attendancePercent }`        | ✅   |
| DELETE | `/api/students/{id}`     | —                                           | ✅   |

### Marks

| Method | Route                  | Body                                                      | Auth |
|--------|------------------------|-----------------------------------------------------------|------|
| POST   | `/api/marks`           | `{ studentId, subject1..5 }` (upsert)                    | ✅   |
| GET    | `/api/marks/{studentId}` | —                                                       | ✅   |

---

## Connecting the React Frontend

The frontend's `api.js` already points to `http://localhost:5000/api`.
Start the .NET backend instead of (or alongside) the Node backend — no frontend changes needed.

```bash
# Terminal 1 — .NET API
cd StudentCrudAPI && dotnet run

# Terminal 2 — React (Vite)
cd student_crud/frontend/design && npm run dev
```

---

## EF Core — Useful Commands

```bash
# Add a new migration after model changes
dotnet ef migrations add <MigrationName>

# Apply pending migrations
dotnet ef database update

# Roll back to a specific migration
dotnet ef database update <MigrationName>

# Drop the database entirely
dotnet ef database drop

# Generate SQL script instead of applying
dotnet ef migrations script
```

---

## Environment Variables (alternative to appsettings)

You can override any key using environment variables with `__` as separator:

```bash
export ConnectionStrings__DefaultConnection="Server=..."
export Jwt__Secret="super_secret"
export Email__User="you@gmail.com"
export Email__Pass="app_password"
```

---

## Production Notes

1. Replace `appsettings.json` secrets with environment variables or Azure Key Vault.
2. Remove the `db.Database.Migrate()` auto-migration call from `Program.cs` and run migrations as a deployment step.
3. Set `ASPNETCORE_ENVIRONMENT=Production` — Swagger is disabled outside Development.
4. Use HTTPS and set `AllowedOrigins` to your actual frontend domain in CORS config.
