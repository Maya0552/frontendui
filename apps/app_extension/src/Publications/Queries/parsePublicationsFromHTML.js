export const parsePublicationsFromHTML = (htmlText) => {
  const parser = new DOMParser();
  // Obalíme htmlText do <table>, aby byl validní
  const wrappedHTML = `<table>${htmlText}</table>`;
  const doc = parser.parseFromString(wrappedHTML, 'text/html');
  
  // Zkusíme vybrat všechny řádky s publikacemi (tr s id začínajícím "vysledekList_")
  const rows = Array.from(doc.querySelectorAll('tr[id^="vysledekList_"]'));
  
  // Pokud žádné publikace nejsou nalezeny, zkontrolujeme, zda se zobrazuje informační hláška
  if (rows.length === 0) {
    console.log('Info: 0 vysledku');
    console.log(htmlText);
    const infoMessage = doc.querySelector('.alert-info .pre-wrap');
    if (infoMessage) {
      console.log('Info:', infoMessage.textContent.trim());
    }
    return [];
  }
  
  // Zpracujeme každý řádek a extrahujeme data
  return rows.map(row => {
    const id = row.id.replace('vysledekList_', '');
    const tds = row.querySelectorAll('td');
    
    // První <td>: původní jazyk a druh publikace
    const langTd = tds[0];
    const lang = langTd.querySelector('li')?.getAttribute('title') || '';
    const type = langTd.querySelector('li:nth-child(2) strong')?.textContent.trim() || '';
    
    // Druhé <td>: rok uplatnění
    const year = tds[1].querySelector('.pre-wrap')?.textContent.trim() || '';
    
    // Třetí <td>: titulek a autoři
    const titleAuthorsTd = tds[2];
    const title = titleAuthorsTd.querySelector('a.pre-wrap.fw-bold')?.textContent.trim() || '';
    // Autoři jsou ve druhém <li>
    const authorLinks = titleAuthorsTd.querySelectorAll('li:nth-child(2) a');
    const authors = Array.from(authorLinks).map(link => {
      const name = link.textContent.trim();
      // Z href získáme id, např. "/vvi/Autor/236007" -> "236007"
      const href = link.getAttribute('href') || '';
      const parts = href.split('/');
      const authorId = parts[parts.length - 1];
      return { name, id: authorId };
    });
    
    // Čtvrté <td>: publikace ID
    const publicationId = tds[3].querySelector('.pre-wrap')?.textContent.trim() || '';
    
    // Páté <td>: podíl za UO
    const share = tds[4].querySelector('.pre-wrap')?.textContent.trim() || '';
    
    return {
      id,       // získané z tr.id
      year,
      title,
      publicationId,
      share,
      originalLanguage: lang,
      type,
      authors
    };
  });
};