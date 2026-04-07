using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace StudentCrudAPI.Services;

public interface IJwtService
{
    string GenerateToken(int id, string email);
}

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(int id, string email)
    {
        var secret  = _config["Jwt:Secret"] ?? throw new InvalidOperationException("JWT secret not configured");
        var expires = _config["Jwt:ExpiresIn"] ?? "1h";

        var key   = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("id",   id.ToString()),
            new Claim("email", email),
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        // Parse "1h", "7d", "30m" style expiry strings
        var expiry = ParseExpiry(expires);

        var token = new JwtSecurityToken(
            claims:   claims,
            expires:  DateTime.UtcNow.Add(expiry),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static TimeSpan ParseExpiry(string expiry)
    {
        if (expiry.EndsWith('h') && int.TryParse(expiry[..^1], out var hours))
            return TimeSpan.FromHours(hours);
        if (expiry.EndsWith('d') && int.TryParse(expiry[..^1], out var days))
            return TimeSpan.FromDays(days);
        if (expiry.EndsWith('m') && int.TryParse(expiry[..^1], out var mins))
            return TimeSpan.FromMinutes(mins);
        return TimeSpan.FromHours(1); // default
    }
}
