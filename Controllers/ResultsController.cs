﻿using Microsoft.AspNetCore.Mvc;
using DocumentFormat.OpenXml.Packaging; // Importuje knihovnu pro práci s dokumenty OpenXml
using DocumentFormat.OpenXml.Wordprocessing; // Importuje třídy pro práci s dokumenty Word
using System.Collections.Generic;
using System.IO;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using CopyCat.Models;
using DocumentFormat.OpenXml; // Importuje knihovnu OpenXml pro práci s dokumenty Word

namespace CopyCat.Controllers
{
    public class ResultsController : Controller // Definuje kontroler ResultsController, který dědí z Controller třídy
    {
        [HttpPost] // Atribut, který označuje, že akce SaveResults reaguje na HTTP POST požadavky
        public async Task<IActionResult> SaveResults([FromBody] ResultsModel model) // Akce SaveResults, která přijímá ResultsModel jako parametr
        {
            var sanitizedQuery = Regex.Replace(model.Query, @"[^\w\s]", "").Replace(" ", "_"); // Sanitizace dotazu odstraněním speciálních znaků a nahrazením mezer podtržítky
            var downloadsFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads"); // Získání cesty k adresáři pro stahování souborů
            var filePath = Path.Combine(downloadsFolder, $"{sanitizedQuery}.docx"); // Sestavení cesty k výslednému souboru

            // Kontrola, zda soubor již existuje, a případné přejmenování, aby nedošlo k přepsání existujícího souboru
            int fileCount = 1;
            while (System.IO.File.Exists(filePath))
            {
                filePath = Path.Combine(downloadsFolder, $"{sanitizedQuery}({fileCount}).docx");
                fileCount++;
            }

            await SaveResultsToWordFile(model.Results, filePath); // Asynchronní uložení výsledků do souboru ve formátu Word
            return Json(new { message = "Results saved", filePath }); // Vrácení JSON odpovědi s informací o úspěšném uložení výsledků
        }

        // Metoda pro asynchronní uložení výsledků do souboru ve formátu Word
        private async Task SaveResultsToWordFile(List<string> results, string filePath)
        {
            // Otevření nového dokumentu Word
            using (WordprocessingDocument wordDocument = WordprocessingDocument.Create(filePath, WordprocessingDocumentType.Document))
            {
                MainDocumentPart mainPart = wordDocument.AddMainDocumentPart(); // Přidání hlavní části dokumentu
                mainPart.Document = new Document(); // Vytvoření nového dokumentu
                Body body = mainPart.Document.AppendChild(new Body()); // Přidání těla dokumentu

                // Pro každý výsledek vytvoří odstavec a vloží ho do dokumentu
                foreach (var result in results)
                {
                    Paragraph para = body.AppendChild(new Paragraph());
                    Run run = para.AppendChild(new Run());
                    run.AppendChild(new Text(result));
                }

                mainPart.Document.Save(); // Uložení dokumentu
            }

            await Task.CompletedTask; // Ukončení as
