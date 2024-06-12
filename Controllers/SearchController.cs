using Microsoft.AspNetCore.Mvc; 
using HtmlAgilityPack; // Importuje knihovnu pro práci s HTML dokumenty
using System.Collections.Generic; 
using System.Net.Http; 
using System.Threading.Tasks; 
using System.Web; // Importuje System.Web pro práci s HTML entitami
using CopyCat.Models; // Importuje CopyCat.Models pro použití modelů aplikace

namespace CopyCat.Controllers // Definuje jmenný prostor CopyCat.Controllers
{
    public class SearchController : Controller // Definuje kontroler SearchController, který dědí z Controller třídy
    {
        public IActionResult Index() // Akce pro zobrazení indexové stránky
        {
            return View(); // Vrátí zobrazení indexové stránky
        }

        [HttpPost] // Atribut, který označuje, že akce Search reaguje na HTTP POST požadavky
        public async Task<IActionResult> Search([FromBody] SearchModel model) // Akce Search, která přijímá SearchModel jako parametr
        {
            var results = await PerformGoogleSearch(model.Query); // Vykoná hledání na Googlu a získá výsledky
            return Json(new { results, query = model.Query }); // Vrátí JSON odpověď s výsledky a dotazem
        }

        // Metoda pro asynchronní vykonání hledání na Googlu
        private async Task<List<string>> PerformGoogleSearch(string query)
        {
            var results = new List<string>(); // Inicializuje kolekci pro uložení výsledků
            var url = $"https://www.google.com/search?q={System.Net.WebUtility.UrlEncode(query)}"; // Vytvoří URL pro hledání na Google
            var httpClient = new HttpClient(); // Inicializuje HttpClient pro provádění HTTP požadavků
            var response = await httpClient.GetAsync(url); // Odešle HTTP GET požadavek na Google
            var pageContents = await response.Content.ReadAsStringAsync(); // Přečte odpověď od Google jako řetězec

            var htmlDoc = new HtmlDocument(); // Inicializuje objekt pro zpracování HTML dokumentu
            htmlDoc.LoadHtml(pageContents); // Načte HTML obsah do objektu

            var nodes = htmlDoc.DocumentNode.SelectNodes("//div[@class='BNeawe vvjwJb AP7Wnd'] | //div[@class='BNeawe deIvCb AP7Wnd'] | //div[@class='BNeawe s3v9rd AP7Wnd']"); 
            //vyhledávání na základě standardně používaných tříd googlem

            if (nodes != null) // Pokud existují vybrané uzly
            {
                for (int i = 0; i < nodes.Count; i++) // Projde všechny vybrané uzly
                {
                    // Dekóduje HTML entity v textu a přidá text do kolekce výsledků
                    var decodedText = HttpUtility.HtmlDecode(nodes[i].InnerText);
                    results.Add(decodedText);

                    // Pokud existuje popisek, přidá ho k nadpisu a přeskočí další uzel
                    if (i + 1 < nodes.Count && nodes[i + 1].GetClasses().Contains("BNeawe s3v9rd AP7Wnd"))
                    {
                        var decodedDescription = HttpUtility.HtmlDecode(nodes[i + 1].InnerText);
                        results.Add(decodedDescription);
                        i++; // Přeskočí další uzel
                    }
                }
            }
            else // Pokud nebyly nalezeny žádné výsledky
            {
                results.Add("No results found"); // Přidá zprávu o nenalezených výsledcích do kolekce
            }

            return results; // Vrátí kolekci výsledků
        }
    }
}
