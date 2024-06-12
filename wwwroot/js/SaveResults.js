// �ek� na ud�lost "DOMContentLoaded", co� znamen�, �e skript bude spu�t�n, a� budou na�teny v�echny prvky HTML str�nky.
document.addEventListener("DOMContentLoaded", function () {
    // Vyp�e v konzoli, �e byl na�ten skript "saveResults.js" - lze pou��t pro lad�n� a ov��en�, �e skript byl �sp�n� na�ten.
    console.log('saveResults.js loaded'); // Debugging line

    // P�id� poslucha�e ud�losti kliknut� na tla��tko s id "saveResultsButton".
    document.getElementById('saveResultsButton').addEventListener('click', saveResults);
});

// Funkce pro ulo�en� v�sledk�.
function saveResults() {
    // Inicializuje pr�zdn� pole pro ulo�en� v�sledk�.
    const results = [];
    // Proch�z� v�echny prvky <p> s id "results" a pro ka�d� z nich p�id� text do pole results.
    document.querySelectorAll('#results p').forEach(p => {
        results.push(p.textContent);
    });

    // Z�sk� hodnotu atributu "data-query" z tla��tka s id "saveResultsButton", kter� obsahuje dotaz.
    const query = document.getElementById('saveResultsButton').dataset.query;

    // Pos�l� asynchronn� HTTP POST po�adavek na server, aby ulo�il v�sledky.
    fetch('/Results/SaveResults', { // Zm�n�no na /Results/SaveResults
        method: 'POST', // Metoda po�adavku
        headers: {
            'Content-Type': 'application/json', // Hlavi�ka s typem obsahu (JSON)
        },
        body: JSON.stringify({ results: results, query: query }), // T�lo po�adavku ve form�tu JSON
    }).then(response => response.json()) // Zpracuje odpov�� serveru jako JSON
        .then(data => {
            // Zaloguje �sp�n� ulo�en� v�sledk� a zobraz� u�ivateli v�slednou cestu k ulo�en�mu souboru.
            console.log('Results saved:', data);
            alert(`Results saved to: ${data.filePath}`);
        })
        .catch(error => console.error('Error:', error)); // Zpracuje chybu, pokud dojde k chyb� p�i komunikaci se serverem.
}
