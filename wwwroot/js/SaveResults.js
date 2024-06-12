// Èeká na událost "DOMContentLoaded", což znamená, že skript bude spuštìn, až budou naèteny všechny prvky HTML stránky.
document.addEventListener("DOMContentLoaded", function () {
    // Vypíše v konzoli, že byl naèten skript "saveResults.js" - lze použít pro ladìní a ovìøení, že skript byl úspìšnì naèten.
    console.log('saveResults.js loaded'); // Debugging line

    // Pøidá posluchaèe události kliknutí na tlaèítko s id "saveResultsButton".
    document.getElementById('saveResultsButton').addEventListener('click', saveResults);
});

// Funkce pro uložení výsledkù.
function saveResults() {
    // Inicializuje prázdné pole pro uložení výsledkù.
    const results = [];
    // Prochází všechny prvky <p> s id "results" a pro každý z nich pøidá text do pole results.
    document.querySelectorAll('#results p').forEach(p => {
        results.push(p.textContent);
    });

    // Získá hodnotu atributu "data-query" z tlaèítka s id "saveResultsButton", která obsahuje dotaz.
    const query = document.getElementById('saveResultsButton').dataset.query;

    // Posílá asynchronní HTTP POST požadavek na server, aby uložil výsledky.
    fetch('/Results/SaveResults', { // Zmìnìno na /Results/SaveResults
        method: 'POST', // Metoda požadavku
        headers: {
            'Content-Type': 'application/json', // Hlavièka s typem obsahu (JSON)
        },
        body: JSON.stringify({ results: results, query: query }), // Tìlo požadavku ve formátu JSON
    }).then(response => response.json()) // Zpracuje odpovìï serveru jako JSON
        .then(data => {
            // Zaloguje úspìšné uložení výsledkù a zobrazí uživateli výslednou cestu k uloženému souboru.
            console.log('Results saved:', data);
            alert(`Results saved to: ${data.filePath}`);
        })
        .catch(error => console.error('Error:', error)); // Zpracuje chybu, pokud dojde k chybì pøi komunikaci se serverem.
}
