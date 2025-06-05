using Microsoft.AspNetCore.Mvc;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("Default", policy =>
    {
        policy.AllowAnyHeader().AllowAnyOrigin().AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Default");

app.UseHttpsRedirection();

app.UseStaticFiles();

// This is a very bad way of storing images, with more time would likely use azure blob storage or aws S3
app.MapPost("/api/upload-image", async (HttpRequest request) =>
{
    var file = request.Form.Files["file"];
    if (file == null || file.Length == 0)
        return Results.BadRequest("No file uploaded");

    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
    var filePath = Path.Combine("wwwroot", "uploads", fileName);
    Directory.CreateDirectory("wwwroot/uploads");

    using var stream = new FileStream(filePath, FileMode.Create);
    await file.CopyToAsync(stream);

    // Return image URL
    return Results.Text($"https://localhost:7219/uploads/{fileName}");
});

app.MapDelete("/api/delete-image", ([FromQuery] string name) =>
{
    var path = Path.Combine("wwwroot/uploads", name);
    if (File.Exists(path))
    {
        File.Delete(path);
        return Results.Ok();
    }

    return Results.NotFound();
});

app.Run();
