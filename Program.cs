using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace CopyCat
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // Vytvoøení instance builderu aplikace
            var builder = WebApplication.CreateBuilder(args);

            // Pøidání služeb do kontejneru služeb aplikace
            builder.Services.AddControllersWithViews();

            // Vytvoøení instance hosta aplikace
            var app = builder.Build();

            // Konfigurace HTTP request pipeline
            if (!app.Environment.IsDevelopment())
            {
                // Pøidání middleware pro zpracování chyb v produkèním prostøedí
                app.UseExceptionHandler("/Home/Error");
                // Pøidání middleware pro povinné použití HTTPS
                app.UseHsts();
            }

            // Pøidání middleware pro pøesmìrování HTTP na HTTPS
            app.UseHttpsRedirection();
            // Pøidání middleware pro poskytování statických souborù
            app.UseStaticFiles();
            // Pøidání middleware pro smìrování
            app.UseRouting();
            // Pøidání middleware pro autorizaci
            app.UseAuthorization();

            // Mapování rout pro kontrolery
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.MapControllerRoute(
                name: "vyhledavac",
                pattern: "{controller=Search}/{action=Index}/{id?}");

            app.MapControllerRoute(
                name: "saveresults",
                pattern: "{controller=Results}/{action=SaveResults}/{id?}");

            // Spuštìní hosta aplikace
            app.Run();
        }
    }
}
