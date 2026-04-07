namespace StudentCrudAPI.Models;

public class Marks
{
    public int Id { get; set; }
    public int StudentId { get; set; }
    public double Subject1 { get; set; }
    public double Subject2 { get; set; }
    public double Subject3 { get; set; }
    public double Subject4 { get; set; }
    public double Subject5 { get; set; }
    public double Total { get; set; }
    public double Percentage { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Student Student { get; set; } = null!;
}
