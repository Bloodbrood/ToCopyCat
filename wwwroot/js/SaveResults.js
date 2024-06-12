// Čeká na událost "DOMContentLoaded", což znamená, že skript bude spuštěn, až budou načteny všechny prvky HTML stránky.
document.addEventListener("DOMContentLoaded", function () {
    console.log('saveResults.js loaded'); // Debugging line

    // Přidá posluchače události kliknutí na tlačítko s id "saveResultsButton".
    document.getElementById('saveResultsButton').addEventListener('click', saveResults);
});

// Funkce pro uložení výsledků.
function saveResults() {
    const results = []; // Inicializuje prázdné pole pro uložení výsledků.
    document.querySelectorAll('#results p').forEach(p => {
        results.push(p.textContent); // Prochází všechny prvky <p> s id "results" a pro každý z nich přidá text do pole results.
    });

    const query = document.getElementById('saveResultsButton').dataset.query; // Získá hodnotu atributu "data-query" z tlačítka s id "saveResultsButton", která obsahuje dotaz.

    fetch('/Results/SaveResults', { // Posílá asynchronní HTTP POST požadavek na server, aby uložil výsledky.
        method: 'POST', // Metoda požadavku
        headers: {
            'Content-Type': 'application/json', // Hlavička s typem obsahu (JSON)
        },
        body: JSON.stringify({ results: results, query: query }), // Tělo požadavku ve formátu JSON
    }).then(response => response.json()) // Zpracuje odpověď serveru jako JSON
        .then(data => {
            console.log('Results saved:', data); // Zaloguje úspěšné uložení výsledků a zobrazí uživateli výslednou cestu k uloženému souboru.
            alert(`Results saved to: ${data.filePath}`);

            const downloadLink = document.createElement('a'); // Vytvoří prvek <a> pro stažení souboru.
            downloadLink.href = data.filePath; // Nastaví odkaz na uložený soubor.
            downloadLink.innerText = 'Download results'; // Nastaví text odkazu.
            downloadLink.download = `${query}.docx`; // Nastaví název souboru ke stažení.
            document.body.appendChild(downloadLink); // Přidá odkaz na stránku.
        })
        .catch(error => console.error('Error:', error)); // Zpracuje chybu, pokud dojde k chybě při komunikaci se serverem.
}
