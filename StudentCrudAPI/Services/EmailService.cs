using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;

namespace StudentCrudAPI.Services;

public interface IEmailService
{
    Task SendPasswordResetAsync(string toEmail, string resetLink);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task SendPasswordResetAsync(string toEmail, string resetLink)
    {
        var fromEmail = _config["Email:User"] ?? string.Empty;
        var password  = _config["Email:Pass"] ?? string.Empty;

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("EduManage", fromEmail));
        message.To.Add(MailboxAddress.Parse(toEmail));
        message.Subject = "Password Reset";

        message.Body = new TextPart("html")
        {
            Text = $@"
                <div style=""font-family:sans-serif;max-width:480px;margin:auto"">
                  <h2>Reset Your Password</h2>
                  <p>Click the link below to reset your password. This link expires in <strong>1 hour</strong>.</p>
                  <a href=""{resetLink}"" 
                     style=""display:inline-block;padding:12px 24px;background:#6c63ff;
                             color:#fff;text-decoration:none;border-radius:8px"">
                     Reset Password
                  </a>
                  <p style=""color:#999;margin-top:20px;font-size:12px"">
                    If you didn't request this, ignore this email.
                  </p>
                </div>"
        };

        try
        {
            using var client = new SmtpClient();
            await client.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(fromEmail, password);
            await client.SendAsync(message);
            await client.DisconnectAsync(true);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to send email to {Email}", toEmail);
            throw;
        }
    }
}
