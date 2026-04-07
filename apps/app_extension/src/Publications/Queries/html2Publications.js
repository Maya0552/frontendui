    const extractAuthorId = href =>
        (href.match(/\/vvi\/Autor\/(\d+)/) || [])[1] || null;

    export const html2Publications = (htmlText) => {

        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        const table = doc.querySelector('table.table.table-borderless.table-striped.table-light.table-cellspacing1.border.mb-0');
        if (!table) {
          console.error('Tabulka nebyla nalezena!');
          return [];
        }
        const rows = table.querySelectorAll('tbody tr');
        const results = [];
      
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length < 5) return;
      
          // První buňka: původní jazyk a druh
          const firstCellItems = cells[0].querySelectorAll('li');
          const originalLanguage = firstCellItems.length > 0
            ? (firstCellItems[0].getAttribute('title') || firstCellItems[0].textContent.trim())
            : "";
          const type = firstCellItems.length > 1
            ? firstCellItems[1].textContent.trim()
            : "";
      
          // Druhá buňka: rok uplatnění
          const year = cells[1].textContent.trim();
      
          // Třetí buňka: název a autoři
          const thirdCellItems = cells[2].querySelectorAll('li');
          const title = thirdCellItems.length > 0
            ? (thirdCellItems[0].querySelector('a')?.textContent.trim() || thirdCellItems[0].textContent.trim())
            : "";
          const authors = thirdCellItems.length > 1
            ? Array.from(thirdCellItems[1].querySelectorAll('a')).map(link => ({
                name: link.textContent.trim(),
                id: extractAuthorId(link.href)
              }))
            : [];
      
          // Čtvrtá buňka: id
          const id = cells[3].textContent.trim();
      
          // Pátá buňka: podíl za UO [%]
          const share = cells[4].textContent.trim();
      
          results.push({ originalLanguage, type, year, title, authors, id, share });
        });
      
        return results;
      };