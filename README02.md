# Semestrální projekt – SemesterGQLModel

## Cíl projektu

Cílem projektu je vytvořit frontendovou část aplikace pro práci s entitou `SemesterGQLModel`.
V této fázi (1A projektový den) je cílem vytvořit funkční stránku v režimu **readonly**, která načítá data z backendu pomocí GraphQL a zobrazuje je na stránce.

---

## Aktuální stav

* aplikace běží lokálně
* backend komunikuje přes GraphQL
* data se načítají pomocí query
* funguje readonly stránka semestru
* upraven byl levý panel detailu (MediumContent)
* odstraněny rušivé prvky (např. nástroje)

---

## Deník práce

### 📅 12-04-2026

**Co jsem dělala:**

* snažila jsem se pochopit strukturu projektu
* hledala jsem, kde se skládá readonly stránka
* upravovala jsem komponenty, aby se změnil obsah stránky

**S čím byl problém:**

* nerozuměla jsem, kde se co v projektu nachází
* nebylo jasné, jak spolu komunikují Queries, Pages a Components
* nevěděla jsem, která část stránky je moje a která je generovaná

**Na co jsem přišla:**

* `Fragments.jsx` určuje, jaká data se načítají
* `ReadAsyncAction` volá backend
* `PageBase` skládá stránku
* `LargeCard` rozděluje layout
* `MediumContent` ovlivňuje levý detail
* pravá část stránky je generovaná přes template (`GeneratedContentBase`)

**Jak jsem testovala:**

* přidala jsem do komponenty červený blok, abych ověřila, že se renderuje
* použila jsem `console.log`, abych viděla data (`item`)
* postupně jsem vypínala části kódu (např. template content), abych zjistila, co ovlivňuje stránku

**Jak jsem to vyřešila:**

* upravila jsem `MediumContent.jsx`
* odstranila jsem generovaný výpis, který překrýval moje změny
* zakomentovala jsem `InteractiveMutations`, protože stránka má být readonly
* ověřila jsem, že změny se projeví na stránce

**Závěr:**
Na začátku jsem se v projektu vůbec neorientovala a nerozuměla jsem jeho struktuře.
Postupně jsem pochopila, jak spolu komunikují jednotlivé části (Queries, Pages, Components) a kde se mění obsah stránky. Na začátku jsem se v projektu vůbec neorientovala a nerozuměla jsem jeho struktuře.
Postupně jsem pochopila, jak spolu komunikují jednotlivé části (Queries, Pages, Components) a kde se mění obsah stránky.

Podařilo se mi vytvořit funkční readonly stránku, která načítá data z GraphQL a zobrazuje je v upraveném detailu entity.

Tento krok považuji za základ pro další práci na projektu.

---
