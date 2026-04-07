import { withResponseMiddleware } from '../../General';
import { buildUrlWithQueryParams } from '../../General';

const parsePublicationsFromHTML = (htmlText) => {
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

/**
 * Asynchronní akce pro načtení všech publikací uživatele.
 * Tato funkce má stejnou signaturu jako doGet – přijímá objekt s vlastností `queryParams`.
 * Po každém fetchi kontroluje stav odpovědi, zpracovává HTML pomocí parsePublicationsFromHTML a postupně
 * načítá další stránky podle vráceného json.NextUrl.
 *
 * @param {object} fetchParams - Volitelné parametry pro fetch (výchozí { method: "GET" }).
 * @param {string} baseUrl - Základní URL, která se bude používat pro volání (výchozí "/vvi/Vysledky/GetVysledkyListBody").
 *
 * @returns {Function} Asynchronní funkce, která jako parametr přijímá objekt s vlastností `queryParams`
 * (např. { Uco: 633 }) a vrací Promise s načteným polem publikací.
 *
 * @example
 * // Použití s redux-thunk:
 * dispatch(loadAllUserPublications({ queryParams: { Uco: 633 } }));
 */
export const loadPublications = (baseUrl = '/vvi/Vysledky/GetVysledkyListBody', fetchParams = { method: "GET" }) => async (params) => {
  // Z parametru získáme počáteční hodnoty (např. Uco) z queryParams.
  const { queryParams } = params || {};
  // if (!queryParams || !queryParams.Uco) {
  //   throw new Error("loadAllUserPublications: queryParams must contain property 'Uco'.");
  // }

  let offset = 0;
  let publications = [];
  // Sestavíme počáteční URL s přidaným Offsetem.
  let nextUrl = buildUrlWithQueryParams(baseUrl, { ...queryParams, Offset: offset });

  while (nextUrl) {
    try {
      // Vytvoříme absolutní URL (pro případ, že baseUrl není absolutní)
      const absoluteUrl = new URL(nextUrl, window.location.origin).href;
      const response = await fetch(absoluteUrl, fetchParams);
      const json = await response.json();
      console.log("Response JSON:", json);

      if (!json.Status) {
        console.error("Chyba při načítání dat");
        break;
      }

      // Zpracujeme HTML obsah a získáme publikace pomocí existující funkce
      const newPubs = parsePublicationsFromHTML(json.Data);
      console.log("Nové publikace:", newPubs);

      // Pokud nebyly nalezeny žádné publikace, cyklus ukončíme
      if (newPubs.length === 0) {
        break;
      }

      publications = publications.concat(newPubs);
      offset += newPubs.length;

      // Nastavíme další URL: pokud je v json.NextUrl, použijeme ji (přeměněnou na absolutní URL), jinak ukončíme cyklus
      nextUrl = json.NextUrl ? new URL(json.NextUrl, window.location.origin).toString() : null;
    } catch (error) {
      console.error("Chyba při volání endpointu:", error);
      break;
    }
  }

  console.log("Všechny publikace:", publications);
  return publications;
};


export const loadPublicationsAsyncAction = withResponseMiddleware(
    loadPublications)