# Zadání: GraphQL Read Query Designer

Tento dokument popisuje **funkční a technické zadání** pro GraphQL Read Query Designer,
jak bylo společně upřesněno a potvrzeno v průběhu návrhu.

---

## Cíl

Navrhnout **vizuální GraphQL Read Query Designer v ReactJS**, který:

- pracuje **výhradně nad známým výsledkem GraphQL introspection query**
- interně manipuluje **AST stromem**
- umožňuje **interaktivně sestavit GraphQL read query**
- **vždy pracuje s fragmenty**
- poskytuje výslednou query jako **parametr externí React komponentě**

Designer **neprovádí GraphQL dotaz**, pouze generuje jeho strukturu.

---

## Vstupy

- GraphQL **introspection query result** (JSON)
- React komponenta / callback, která:
  - převezme vygenerovanou query (AST nebo string)
  - sama řeší její vykonání

---

## Základní pracovní postup

### 1. Výběr root query fieldu

Designer začíná výběrem:

- `Query → konkrétní field`  
  (např. `user`, `users`, `roleType`, …)

---

### 2. Automatický výběr polí

Po výběru root fieldu se **automaticky vyberou** všechna pole, která:

- **nerozšiřují strom**
  - scalar / enum
- **nemají povinné parametry**
  - povoleny jsou pouze nepovinné argumenty

Tím vznikne **počáteční minimální strom query**.

---

### 3. Rozšiřování stromu

Uživatel může strom **ručně rozšiřovat**:

- kliknutím na field, který:
  - nemá povinné parametry
  - vrací **obalený objektový typ**
    - Object
    - List<Object>
    - NonNull<Object>

Takové pole:
- vytvoří **nový podstrom**
- aplikuje stejná pravidla:
  - automatický výběr „bezpečných“ polí
  - možnost dalšího rozšíření

---

### 4. Chování podle typu fieldu

| Typ fieldu | Chování |
|-----------|--------|
| Scalar / Enum | Přidán automaticky (pokud nemá povinné parametry) |
| Object / List<Object> | Přidán ručně kliknutím |
| Field s povinnými parametry | Nepřidává se automaticky |

---

## Fragmenty

- Designer **vždy používá fragmenty**
- Každý objektový typ odpovídá fragmentu
- Root query:
  - pouze skládá fragmenty
- Cílem je:
  - čitelnost
  - znovupoužitelnost
  - kompatibilita s React / GraphQL toolingem

---

## Stav designeru

- Interní stav je reprezentován jako:
  - **GraphQL AST (`DocumentNode`)**
- Nad AST jsou prováděny:
  - přidávání / odebírání fieldů
  - vkládání fragment spreadů
  - generování inline selection setů

---

## Detekce cyklů fragmentů

Designer musí zabránit:

- přímým cyklům (`A → A`)
- nepřímým cyklům (`A → B → C → A`)

Používá se:

- graf závislostí fragmentů
- kontrola cyklu při každém rozvinutí fieldu

---

### Chování při cyklu (defaultní politika)

Pokud by rozvinutí fieldu vytvořilo cyklus:

- fragment spread **se nepřidá**
- místo toho se použije **leaf fallback**
  - inline selection set
  - pouze scalar / enum fieldy bez povinných parametrů
- výsledná query zůstává:
  - validní
  - acyklická
  - bezpečná

---

## Technologie

- JavaScript / JSX (bez TypeScriptu)
- ReactJS
- graphql-js
- žádná vazba na konkrétní GraphQL klient (Apollo, Relay, …)

---

## Výstup designeru

Designer poskytuje:

- `DocumentNode` (AST)
- nebo stringovou reprezentaci (`print(document)`)

Formou:

- callbacku `onChange`
- nebo props pro externí React komponentu

---

## Neřešené / rozšiřitelné oblasti

- editor argumentů (optional args)
- podpora interface / union přes inline fragmenty
- hloubkově omezená rekurze fragmentů
- plnohodnotný stromový UI editor

---

## Shrnutí

GraphQL Read Query Designer je:

- headless-first nástroj
- postavený na introspection datech
- řízený AST stromem
- fragmentově orientovaný
- bezpečný vůči cyklům
- snadno integrovatelný do React aplikací

# GraphQL Read Query Designer – Shrnutí vygenerovaného kódu

Tento dokument shrnuje architekturu a chování vygenerovaného GraphQL Read Query Designeru
implementovaného v čistém JavaScriptu (JS/JSX).

---

## Architektura

designer/
├── core/
│   ├── schemaUtils.js
│   ├── depGraph.js
│   ├── astOps.js
│   └── createDesignerState.js
└── ui/
    └── QueryReadDesigner.jsx

- core/: headless logika, žádná závislost na Reactu  
- ui/: tenká React vrstva nad core enginem  

---

## Základní principy

- vstup: GraphQL introspection JSON
- interní stav: GraphQL AST (DocumentNode)
- výstup:
  - AST dokument
  - stringová reprezentace (print)
- query je vždy složena z fragmentů
- automatický výběr scalar/enum fieldů bez povinných argumentů
- rozvinutí objektových fieldů přes fragmenty
- detekce cyklů fragmentů (i nepřímých)
- při cyklu: leaf fallback (inline selection set)

---

## Core moduly

### schemaUtils.js

Pomocné funkce nad schématem:

- unwrapType
- hasRequiredArgs
- isExpandingNamedType
- isLeafNamedType
- getSafeScalarFieldNames
- getFieldDef

Používá se k rozhodování, zda field rozšiřuje strom
a zda může být automaticky vybrán.

---

### depGraph.js

Správa grafu závislostí fragmentů:

- fragment = uzel
- fragment spread = hrana

Funkce:
- addEdge
- wouldCreateCycle
- formatCyclePath

Umožňuje detekci cyklů typu:
User → Post → User

---

### astOps.js

Manipulace s GraphQL AST:

- vytvoření documentu a fragmentů
- automatický výběr safe scalar fieldů
- toggle scalar fieldu
- rozvinutí objektového fieldu:
  - fragment spread
  - nebo leaf fallback při cyklu

---

### createDesignerState.js

Inicializace a veřejné API:

- createDesignerState
- listRootQueryFields
- setRootField
- getOutput

Stav obsahuje:
- schema
- document (AST)
- fragmentsByType
- depGraph
- policy
- lastActionInfo

---

## React UI

### QueryReadDesigner.jsx

Minimální ovládací UI:

- výběr root query fieldu
- seznam fieldů aktuálního fragmentu
- kliknutí:
  - scalar → toggle
  - object → expand
- zobrazení:
  - vygenerované query
  - informace o cyklu nebo blokaci

Designer pouze generuje query,
nevykonává GraphQL dotaz.

---

## Chování při cyklu

Pokud by rozvinutí fieldu vytvořilo cyklus:

User → Post → User

Designer:
- nepřidá fragment spread
- místo toho použije inline selection set
- pouze safe scalar/enum fieldy
- uloží informaci o cyklu do lastActionInfo

---

## Stav designeru (zjednodušeně)

{
  schema,
  document,
  fragmentsByType,
  depGraph,
  policy,
  rootField,
  lastActionInfo
}

---

## Připraveno pro rozšíření

- stromové UI libovolné hloubky
- editor optional argumentů
- interface / union přes inline fragmenty
- depth-based rekurze fragmentů

---

## Shrnutí

- čistý JS / JSX
- headless core + React UI
- AST jako zdroj pravdy
- fragment-first přístup
- bezpečné zacházení s cykly