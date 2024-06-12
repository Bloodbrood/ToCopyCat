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
            // Vytvo�en� instance builderu aplikace
            var builder = WebApplication.CreateBuilder(args);

            // P�id�n� slu�eb do kontejneru slu�eb aplikace
            builder.Services.AddControllersWithViews();

            // Vytvo�en� instance hosta aplikace
            var app = builder.Build();

            // Konfigurace HTTP request pipeline
            if (!app.Environment.IsDevelopment())
            {
                // P�id�n� middleware pro zpracov�n� chyb v produk�n�m prost�ed�
                app.UseExceptionHandler("/Home/Error");
                // P�id�n� middleware pro povinn� pou�it� HTTPS
                app.UseHsts();
            }

            // P�id�n� middleware pro p�esm�rov�n� HTTP na HTTPS
            app.UseHttpsRedirection();
            // P�id�n� middleware pro poskytov�n� statick�ch soubor�
            app.UseStaticFiles();
            // P�id�n� middleware pro sm�rov�n�
            app.UseRouting();
            // P�id�n� middleware pro autorizaci
            app.UseAuthorization();

            // Mapov�n� rout pro kontrolery
            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.MapControllerRoute(
                name: "vyhledavac",
                pattern: "{controller=Search}/{action=Index}/{id?}");

            app.MapControllerRoute(
                name: "saveresults",
                pattern: "{controller=Results}/{action=SaveResults}/{id?}");

            // Spu�t�n� hosta aplikace
            app.Run();
        }
    }
}
