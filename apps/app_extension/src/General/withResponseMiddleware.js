/**
 * withResponseMiddleware
 *
 * @param {Function} fetcher - Funkce, která provádí fetch (např. vytvořená funkcí A) a vrací Promise s Response.
 * @param {...Function} middlewares - Jedna či více middleware funkcí, každá s podpisem:
 *    (result) => (dispatch, getState, next) => Promise<transformedResult>
 *
 * @returns {Function} Vrací dispatchovatelnou thunk akci, která:
 *    - Přijímá volitelné options pro fetch.
 *    - Vykoná fetch pomocí fetcheru.
 *    - Řetězově zpracuje výsledek pomocí předaných middleware funkcí.
 *
 * @example
 * // Předpokládejme, že máme funkci fetcher a middleware responseToPublications, která například:
 * const responseToPublications = (response) => async (dispatch, getState, next) => {
 *    const html = await response.text();
 *    const publications = parsePublicationsFromHTML(html);
 *    return next(publications);
 * };
 *
 * // Vytvoření fetcheru (funkce, která zavolá fetch a vrátí Response)
 * const fetcher = (options) => fetch('/vvi/Vysledky/GetVysledekBiblio?Uco=666&Offset=0', options);
 *
 * // Vytvoření dispatchovatelné akce:
 * const getPublicationsAction = withResponseMiddleware(fetcher, responseToPublications);
 *
 * // Použití (v Redux thunk):
 * dispatch(getPublicationsAction());
 */
export const withResponseMiddleware = (fetcher, ...middlewares) => {
    return (options = {}) => {
      // Tato funkce je dispatchovatelná (thunk action)
      return async (dispatch, getState, next = (result) => result) => {
        try {
          // Provedeme fetch
          const response = await fetcher(options);
    
          // Sestavíme middleware řetězec (podobně jako ve createAsyncGraphQLAction)
          const chain = middlewares.reduceRight(
            (nextMiddleware, middleware) => {
              return async (result) => {
                return middleware(result)(dispatch, getState, nextMiddleware);
              };
            },
            // Základní "next" – pokud není další middleware, prostě vrátí výslednou hodnotu
            next
          );
    
          // Spustíme middleware řetězec s počáteční hodnotou Response
          return await chain(response);
        } catch (error) {
          console.error("withResponseMiddleware: Chyba při provádění fetch nebo middleware", error);
          throw error;
        }
      };
    };
  };


// import aiohttp
// import asyncio

// def with_response_middleware(response_fn, *middlewares):
//     """
//     Vytvoří asynchronní funkci, která nejprve zavolá `response_fn` (např. HTTP GET)
//     a následně předá získaný Response do řetězce middleware funkcí.

//     :param response_fn: Asynchronní funkce, která provede HTTP požadavek a vrátí Response.
//                         Např. async def fetch(url): ...
//     :param middlewares: Libovolný počet asynchronních middleware funkcí se signaturou:
//                         async def middleware(response, next_fn) -> result
//     :return: Asynchronní funkce, která při zavolání provede požadavek a zřetězí middleware.
//     """
//     # Výchozí "next" funkce, která jednoduše vrátí předaný argument
//     async def identity(response):
//         return response

//     # Sestavení řetězce middleware (od posledního k prvnímu)
//     chain = identity
//     for middleware in reversed(middlewares):
//         next_chain = chain
//         # Vytvoříme novou asynchronní funkci, která obalí aktuální middleware a předá
//         # výsledek do dalšího článku řetězce
//         async def new_chain(response, middleware=middleware, next_chain=next_chain):
//             return await middleware(response, next_chain)
//         chain = new_chain

//     async def wrapped_function(*args, **kwargs):
//         # Nejprve získáme response pomocí response_fn
//         response = await response_fn(*args, **kwargs)
//         # Pak předáme response do middleware řetězce
//         return await chain(response)

//     return wrapped_function

// # ----- Příklad použití s aiohttp -----

// # Asynchronní funkce, která provede HTTP GET požadavek na zadanou URL
// async def fetch_url(url):
//     async with aiohttp.ClientSession() as session:
//         async with session.get(url) as response:
//             # Například vrátíme response objekt, nebo můžete předat response.text(), response.json(), atd.
//             return response

// # Příklad middleware, který zaloguje status HTTP odpovědi
// async def log_status(response, next_fn):
//     print("HTTP status:", response.status)
//     # Pokračujeme ve zpracování s dalším middleware
//     return await next_fn(response)

// # Příklad middleware, který transformuje obsah odpovědi na JSON
// async def to_json(response, next_fn):
//     json_data = await response.json()
//     return await next_fn(json_data)

// # Příklad "identity" middleware, který jen vrací předaný výsledek
// async def identity_middleware(result):
//     return result

// # Sestavíme funkci, která zřetězí middleware
// fetch_with_middleware = with_response_middleware(fetch_url, log_status, to_json, lambda result, next_fn: next_fn(result))

// # Spusťme příklad pomocí asyncio
// async def main():
//     url = "https://api.example.com/data"  # nahraďte skutečnou URL
//     final_result = await fetch_with_middleware(url)
//     print("Final result:", final_result)

// # Pokud spouštíte tento skript přímo, použijte:
// if __name__ == "__main__":
//     asyncio.run(main())

  