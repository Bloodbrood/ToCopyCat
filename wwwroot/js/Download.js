// Funkce pro stahování souboru podle zadané URL
function downloadFile(url) {
    // Vytvoříme nový element anchor pro stahování
    const anchor = document.createElement('a');
    // Nastavíme atributy pro stahování
    anchor.href = url;
    anchor.download = ''; // Tímto umožníme, aby uživatel mohl soubor stáhnout pod libovolným názvem
    // Přidáme element do DOMu, ale neviditelně
    anchor.style.display = 'none';
    document.body.appendChild(anchor);
    // Simulujeme kliknutí na anchor pro spuštění stahování
    anchor.click();
    // Odstraníme anchor z DOMu po dokončení stahování
    document.body.removeChild(anchor);
}
