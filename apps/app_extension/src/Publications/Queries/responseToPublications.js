// Předpokládáme, že již existuje funkce parsePublicationsFromHTML, která bere HTML řetězec a vrací pole publikací
// a také předpokládáme, že máte definovanou akci PublicationActions.publication_update (můžete ji nahradit vlastní akcí).

export const responseToPublications = (jsonData) => async (dispatch, getState, next = (jsonResult) => jsonResult) => {
    // Očekáváme, že HTML řetězec je uložen v jsonData.Data
    const htmlText = jsonData?.Data;
    if (!htmlText) {
      console.warn("responseToPublications: Nenalezeno HTML v odpovědi", jsonData);
      return next(jsonData);
    }
  
    // Transformujeme HTML do seznamu publikací
    const publications = parsePublicationsFromHTML(htmlText);
  
    if (publications && publications.length > 0) {
      // Příklad: pro každou publikaci dispatchujeme akci – nahraďte PublicationActions.publication_update vlastní akcí!
      publications.forEach((pub) => {
        dispatch(PublicationActions.publication_update(pub));
      });
    } else {
      console.warn("responseToPublications: Nebyla nalezena žádná publikace v HTML.");
    }
  
    // Vrátíme dále jsonData s připojeným polem publikací (můžete to upravit dle potřeby)
    return next({ ...jsonData, publications });
  };
  