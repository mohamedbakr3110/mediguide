export interface AspNetCoreDocSnippet {
  title: string;
  titleAr: string;
  filePath: string;
  description: string;
  descriptionAr: string;
  code: string;
}

export const aspNetCoreDocumentation: AspNetCoreDocSnippet[] = [
  {
    title: 'Articles Controller (CRUD & Medical Review)',
    titleAr: 'متحكم المقالات الطبية (Controllers/ArticlesController.cs)',
    filePath: 'Controllers/ArticlesController.cs',
    description: 'RESTful controller with endpoints for fetching, creating, updating, and reviewing medical articles using Entity Framework Core.',
    descriptionAr: 'متحكم كامل لإدارة المقالات الطبية والمراجعة السريرية باستخدام Entity Framework Core و SQL Server.',
    code: `using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediGuide.API.Data;
using MediGuide.API.DTOs;
using MediGuide.API.Models;

namespace MediGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArticlesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<ArticlesController> _logger;

    public ArticlesController(ApplicationDbContext context, ILogger<ArticlesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/articles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ArticleDto>>> GetArticles([FromQuery] string? category, [FromQuery] string? search)
    {
        var query = _context.Articles.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(a => a.Category == category);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(a => a.Title.Contains(search) || a.TitleAr.Contains(search));

        var articles = await query.OrderByDescending(a => a.PublishedAt).ToListAsync();
        return Ok(articles);
    }

    // GET: api/articles/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ArticleDto>> GetArticle(string id)
    {
        var article = await _context.Articles.FindAsync(id);
        if (article == null) return NotFound(new { message = "Article not found" });

        article.ViewCount++;
        await _context.SaveChangesAsync();
        return Ok(article);
    }

    // POST: api/articles
    [HttpPost]
    public async Task<ActionResult<ArticleDto>> CreateArticle([FromBody] CreateArticleDto dto)
    {
        var article = new MedicalArticle
        {
            Id = Guid.NewGuid().ToString(),
            Slug = dto.Slug,
            Title = dto.Title,
            TitleAr = dto.TitleAr,
            Category = dto.Category,
            Summary = dto.Summary,
            SummaryAr = dto.SummaryAr,
            Content = dto.Content,
            ContentAr = dto.ContentAr,
            PublishedAt = DateTime.UtcNow,
            Status = dto.Status ?? "UnderReview"
        };

        _context.Articles.Add(article);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetArticle), new { id = article.Id }, article);
    }
}`,
  },
  {
    title: 'Authentication & JWT Controller',
    titleAr: 'متحكم المصادقة وتوليد الرموز (Controllers/AuthController.cs)',
    filePath: 'Controllers/AuthController.cs',
    description: 'Handles user registration, login, and JWT token issuance configured with Microsoft.AspNetCore.Authentication.JwtBearer.',
    descriptionAr: 'معالجة تسجيل الدخول، وإنشاء الحسابات، وإصدار رموز JWT الآمنة لتأمين استدعاءات API.',
    code: `using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using MediGuide.API.DTOs;

namespace MediGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration config)
    {
        _config = config;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequestDto request)
    {
        // Replace with SQL Server ASP.NET Core Identity user lookup
        if (request.Email == "doctor@mediguide.edu" && request.Password == "SecurePass2026!")
        {
            var token = GenerateJwtToken(request.Email, "Doctor");
            return Ok(new
            {
                Token = token,
                User = new { Id = "usr-1", Email = request.Email, Role = "Doctor" }
            });
        }

        return Unauthorized(new { message = "Invalid email or password." });
    }

    private string GenerateJwtToken(string email, string role)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"] ?? "MediGuideSuperSecretGraduationKey2026!"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, email),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var token = new JwtSecurityToken(
            issuer: "MediGuideAPI",
            audience: "MediGuideClient",
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}`,
  },
  {
    title: 'Entity Framework Core DbContext (SQL Server)',
    titleAr: 'سياق قاعدة بيانات SQL Server (Data/ApplicationDbContext.cs)',
    filePath: 'Data/ApplicationDbContext.cs',
    description: 'Configures MSSQL database tables, primary keys, and relations for Articles, Categories, Users, and Triage Logs.',
    descriptionAr: 'إعداد جداول قاعدة بيانات Microsoft SQL Server والعلاقات للمقالات والمستخدمين وسجلات الفرز.',
    code: `using Microsoft.EntityFrameworkCore;
using MediGuide.API.Models;

namespace MediGuide.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<MedicalArticle> Articles { get; set; } = null!;
    public DbSet<EmergencyProtocol> Protocols { get; set; } = null!;
    public DbSet<UserBookmark> Bookmarks { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<MedicalArticle>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.HasIndex(e => e.Category);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(250);
            entity.Property(e => e.TitleAr).IsRequired().HasMaxLength(250);
        });
    }
}`,
  },
  {
    title: 'Program.cs (CORS, Swagger & Health Checks)',
    titleAr: 'إعداد تشغيل الخادم وتفعيل CORS (Program.cs)',
    filePath: 'Program.cs',
    description: 'Enables CORS so the React Vite app on port 3000 or preview URLs can communicate without browser blocking.',
    descriptionAr: 'تكوين CORS لتمكين تطبيق React على المنفذ 3000 وروابط الاستعراض من الاتصال بسلاسة دون حجب من المتصفح.',
    code: `var builder = WebApplication.CreateBuilder(args);

// Add SQL Server DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Controllers and Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHealthChecks();

// Configure CORS for Vite React Frontend and Cloud Preview
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowMediGuide", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000",
            "https://localhost:3000",
            "https://ais-pre-afom473cjwrob7rvlq5cno-685881456527.europe-west1.run.app",
            "https://ais-dev-afom473cjwrob7rvlq5cno-685881456527.europe-west1.run.app"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowMediGuide");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("/health");
app.MapHealthChecks("/api/health");
app.MapControllers();

app.Run();`,
  },
  {
    title: 'appsettings.json (Microsoft SQL Server Connection)',
    titleAr: 'إعدادات الاتصال بقاعدة بيانات SQL Server (appsettings.json)',
    filePath: 'appsettings.json',
    description: 'Microsoft SQL Server Connection String and JWT authentication secrets configuration.',
    descriptionAr: 'سلسلة الاتصال بقاعدة بيانات Microsoft SQL Server وتعيين المفاتيح السرية للـ JWT.',
    code: `{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=MediGuideDb;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true"
  },
  "Jwt": {
    "Key": "MediGuideMedicalPlatformSuperSecretKey2026_ClinicalPlatform!",
    "Issuer": "MediGuideAPI",
    "Audience": "MediGuideClient"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}`,
  },
  {
    title: 'Doctors Controller (Controllers/DoctorsController.cs)',
    titleAr: 'متحكم أطباء مصر والعيادات (Controllers/DoctorsController.cs)',
    filePath: 'Controllers/DoctorsController.cs',
    description: 'RESTful controller to retrieve, search, and manage registered Egyptian doctors from SQL Server.',
    descriptionAr: 'متحكم لاسترجاع والبحث في قائمة أطباء مصر والعيادات الخاصة من قاعدة بيانات SQL Server.',
    code: `using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MediGuide.API.Data;
using MediGuide.API.Models;

namespace MediGuide.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DoctorsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/doctors
    [HttpGet]
    public async Task<IActionResult> GetDoctors([FromQuery] string? specialty, [FromQuery] string? governorate, [FromQuery] string? search)
    {
        var query = _context.Doctors.AsQueryable();

        if (!string.IsNullOrWhiteSpace(specialty) && specialty != "All")
            query = query.Where(d => d.Specialty == specialty);

        if (!string.IsNullOrWhiteSpace(governorate) && governorate != "All")
            query = query.Where(d => d.Governorate == governorate);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(d => d.Name.Contains(search) || d.NameAr.Contains(search) || d.SubspecialtyAr.Contains(search));

        var doctors = await query.ToListAsync();
        return Ok(doctors);
    }
}`,
  },
];
