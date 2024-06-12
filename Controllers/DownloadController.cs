using Microsoft.AspNetCore.Mvc;
using System.IO;

namespace CopyCat.Controllers
{
    public class DownloadController : Controller
    {
        public IActionResult GetDownloadUrl(string filePath)
        {
            var fileFullPath = Path.Combine(@"C:\home\site\wwwroot", filePath); // Zde specifikuj cestu k adresáři na serveru, kde jsou uloženy soubory

            if (!System.IO.File.Exists(fileFullPath))
            {
                return NotFound();
            }

            var memory = new MemoryStream();
            using (var stream = new FileStream(fileFullPath, FileMode.Open))
            {
                stream.CopyTo(memory);
            }
            memory.Position = 0;

            return File(memory, "application/octet-stream", Path.GetFileName(fileFullPath));
        }
    }
}
