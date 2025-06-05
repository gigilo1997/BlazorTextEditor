using BlazorTextEditor;
using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

using var tempClient = new HttpClient { BaseAddress = new Uri(builder.HostEnvironment.BaseAddress) };

var stream = await tempClient.GetStreamAsync("appsettings.json");
var config = new ConfigurationBuilder()
    .AddJsonStream(stream)
    .Build();

var appSettings = config.Get<AppSettings>();

builder.Services.AddScoped(sp => new HttpClient
{
    BaseAddress = new Uri(appSettings!.ApiBaseUrl)
});

await builder.Build().RunAsync();
