// Čeká na událost "DOMContentLoaded", což znamená, že skript bude spuštěn, až budou načteny všechny prvky HTML stránky.
document.addEventListener("DOMContentLoaded", function () {
    // Přidá posluchače události submit na formulář s id "searchForm".
    document.getElementById('searchForm').addEventListener('submit', async function (event) {
        event.preventDefault(); // Zabraňuje výchozímu chování formuláře (přenačtení stránky).

        const query = document.getElementById('searchQuery').value; // Získá hodnotu vyhledávacího pole.
        const resultsContainer = document.getElementById('results'); // Získá kontejner pro výsledky.
        const saveResultsButton = document.getElementById('saveResultsButton'); // Získá tlačítko pro uložení výsledků.

        resultsContainer.innerHTML = ''; // Vymaže předchozí výsledky.

        try {
            const response = await fetch(`/search?query=${encodeURIComponent(query)}`); // Odesílá GET požadavek na server.
            const results = await response.json(); // Zpracuje odpověď serveru jako JSON.

            results.forEach(result => {
                const p = document.createElement('p'); // Vytvoří nový prvek <p>.
                p.textContent = result; // Nastaví textový obsah prvku <p>.
                resultsContainer.appendChild(p); // Přidá prvek <p> do kontejneru pro výsledky.
            });

            // Nastaví dotaz do atributu data-query a zobrazí tlačítko pro uložení.
            saveResultsButton.dataset.query = query;
            saveResultsButton.style.display = 'block';
        } catch (error) {
            console.error('Error:', error); // Zpracuje chybu, pokud dojde k chybě při komunikaci se serverem.
        }
    });
});
