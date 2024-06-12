// Čeká na událost "DOMContentLoaded", což znamená, že skript bude spuštěn, až budou načteny všechny prvky HTML stránky.
document.addEventListener("DOMContentLoaded", function () {
    // Vypíše v konzoli, že byl načten skript "search.js" - lze použít pro ladění a ověření, že skript byl úspěšně načten.
    console.log('search.js loaded'); // Debugging line

    // Přidá posluchače události odeslání formuláře pro vyhledávání.
    document.getElementById('searchForm').addEventListener('submit', performGoogleSearch);
    // Přidá posluchače události kliknutí na tlačítko pro uložení výsledků.
    document.getElementById('saveResultsButton').addEventListener('click', saveResults);
});

// Funkce pro provedení vyhledávání pomocí Google.
function performGoogleSearch(event) {
    // Zabraňuje výchozímu chování odeslání formuláře.
    event.preventDefault();
    // Vypíše do konzole, že funkce performGoogleSearch byla zavolána - lze použít pro ladění.
    console.log('performGoogleSearch called'); // Debugging line

    // Získá hodnotu zadanou uživatelem do pole pro hledání.
    const query = document.getElementById('searchQuery').value;
    // Vypíše do konzole, jaký dotaz bude proveden - lze použít pro ladění.
    console.log('Performing search for query:', query); // Debugging line

    // Posílá asynchronní HTTP POST požadavek na server, aby provedl vyhledávání pomocí Google.
    fetch('/Search/Search', {
        method: 'POST', // Metoda požadavku
        headers: {
            'Content-Type': 'application/json', // Hlavička s typem obsahu (JSON)
        },
        body: JSON.stringify({ query: query }), // Tělo požadavku ve formátu JSON
    }).then(response => response.json()) // Zpracuje odpověď serveru jako JSON
        .then(data => {
            // Vypíše do konzole nalezené výsledky - lze použít pro ladění.
            console.log('Results:', data.results); // Debugging line

            // Vyprázdní element s id "results".
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = '';

            // Pro každý nalezený výsledek vloží nový <p> element s textem výsledku do elementu s id "results".
            data.results.forEach(result => {
                const p = document.createElement('p');
                p.textContent = result;
                resultsDiv.appendChild(p);
            });

            // Zobrazí tlačítko pro uložení výsledků, pokud byly nalezeny nějaké výsledky.
            if (data.results.length > 0) {
                document.getElementById('saveResultsButton').style.display = 'block';
                // Uloží dotaz do atributu "data-query" tlačítka pro pozdější použití.
                document.getElementById('saveResultsButton').dataset.query = query;
            } else {
                // Skryje tlačítko pro uložení výsledků, pokud nebyly nalezeny žádné výsledky.
                document.getElementById('saveResultsButton').style.display = 'none';
            }
        })
        .catch(error => console.error('Error:', error)); // Zpracuje chybu, pokud dojde k chybě při komunikaci se serverem.
}
