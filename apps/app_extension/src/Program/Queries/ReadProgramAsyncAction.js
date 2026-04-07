ReadProgramAsyncAction
import { buildUrlWithQueryParams } from "../../_Utils";
import { ProgramURI } from "../Components";

/**
 * Extracts teacher objects from a container element.
 *
 * Searches for all <a> elements whose href matches "/PortalOsoba/Vyucujici/<id>"
 * and returns an array of teacher objects with properties:
 * - uco: teacher id (string)
 * - name: the link text trimmed.
 *
 * @param {HTMLElement} container - The container element in which to search.
 * @returns {Array<Object>} An array of teacher objects.
 */
const parseTeacherLinks = (container) => {
    const teachers = [];
    if (!container) return teachers;
    const links = container.querySelectorAll("a");
    links.forEach(link => {
      const href = link.getAttribute("href") || "";
      const match = href.match(/\/PortalOsoba\/Vyucujici\/(\d+)/);
      if (match) {
        const teacherId = match[1];
        const name = link.textContent.trim();
        teachers.push({ uco: teacherId, name });
      }
    });
    return teachers;
  };
  
  /**
   * Parses the "Garanti programu" card.
   *
   * Expects the card element with id "ProgramGarantsCard" to contain a single teacher link.
   *
   * @param {HTMLElement} cardEl - The container element for the garants card.
   * @returns {Object|null} A teacher object or null if not found.
   */
  const parseGarantsCard = (cardEl) => {
    if (!cardEl) return null;
    // Look inside the card body for the <a> element
    const link = cardEl.querySelector(".card-body a");
    if (link) {
      const href = link.getAttribute("href") || "";
      const match = href.match(/\/PortalOsoba\/Vyucujici\/(\d+)/);
      if (match) {
        return { uco: match[1], name: link.textContent.trim() };
      }
    }
    return null;
  };
  
  /**
   * Parses the "Link na akreditaci" card.
   *
   * Extracts the link URL, text, and the type (if available) from the header.
   *
   * @param {HTMLElement} cardEl - The container element for the akreditace card.
   * @returns {Object|null} An object with akreditace data or null if not found.
   */
  const parseAkreditaceCard = (cardEl) => {
    if (!cardEl) return null;
    const bodyLink = cardEl.querySelector(".card-body a");
    if (bodyLink) {
      const url = bodyLink.getAttribute("href");
      const title = bodyLink.textContent.trim();
      // Optionally, extract type from the header (if present)
      const headerTypeEl = cardEl.querySelector(".card-header div.text-end");
      const type = headerTypeEl ? headerTypeEl.textContent.trim() : null;
      return { title, url, type };
    }
    return null;
  };
  
  /**
   * Parses the "Seznam předmětů studijního programu" card.
   *
   * Finds each subject card (expected to have the class "card border-opacity-50"),
   * extracts the subject title, semester labels, and calls parseTeacherLinks on the
   * collapsible card body to retrieve teacher objects.
   *
   * @param {HTMLElement} cardEl - The container element for the subject cards.
   * @returns {Array<Object>} An array of subject objects.
   */
  const parseSubjectsCard = (cardEl) => {
    if (!cardEl) return [];
    const subjects = [];
    // Each subject is inside an element with class "card border-opacity-50"
    const subjectCards = cardEl.querySelectorAll(".card.border-opacity-50");
    subjectCards.forEach(subjectCard => {
      let title = "";
      let semesters = [];
      let subjectId = null;
      let teachers = [];
  
      const header = subjectCard.querySelector(".card-header");
      if (header) {
        const strongEl = header.querySelector("strong");
        if (strongEl) {
          title = strongEl.textContent.trim();
        }
        const semesterLinks = header.querySelectorAll("a");
        if (semesterLinks.length > 0) {
          semesters = Array.from(semesterLinks).map(link => link.textContent.trim());
          // Use the first semester link to extract the subject id if possible.
          const href = semesterLinks[0].getAttribute("href") || "";
          const match = href.match(/\/PortalOsoba\/Predmet\/(\d+)/);
          if (match) {
            subjectId = match[1];
          }
        }
      }
      // Teacher links are expected in the collapsible part of the card body.
      const teacherContainer = subjectCard.querySelector(".card-body.collapse");
      if (teacherContainer) {
        teachers = parseTeacherLinks(teacherContainer);
      }
      subjects.push({ uic: subjectId, name: title, semesters, teachers });
    });
    return subjects;
  };
  
  /**
   * Parses the "Skupiny studující program" card.
   *
   * Expects that within the card (with id "ProgramPredmetsCard" in the right column)
   * there are multiple divs with id "StudiumSkupina" each containing an <a> element.
   * For each group, extracts the group id (uic) from the URL and the group name.
   *
   * @param {HTMLElement} cardEl - The container element for the groups card.
   * @returns {Array<Object>} An array of group objects.
   */
  const parseGroupsCard = (cardEl) => {
    const groups = [];
    if (!cardEl) return groups;
    // Each group is in a div with id "StudiumSkupina"
    const groupDivs = cardEl.querySelectorAll("div#StudiumSkupina");
    groupDivs.forEach(div => {
      const link = div.querySelector("a");
      if (link) {
        const href = link.getAttribute("href") || "";
        const match = href.match(/\/PortalOsoba\/StudiumSkupina\/Uic\/(\d+)/);
        if (match) {
          groups.push({ uic: match[1], name: link.textContent.trim() });
        }
      }
    });
    return groups;
  };
  
  /**
   * Parses the portal HTML and extracts structured data from various cards.
   *
   * This function looks for cards with specific IDs and uses the helper parsers to
   * extract data. The returned object includes:
   *  - garants: The "Garanti programu" teacher object.
   *  - akreditace: The akreditace link information.
   *  - subjects: An array of subject objects from the subject list.
   *  - groups: An array of group objects (each with uic and name).
   *
   * @param {HTMLElement} rootEl - The root container element (e.g. the <main> element).
   * @returns {Object} The parsed portal data.
   *
   * @example
   * const root = document.querySelector("main#EventCatch");
   * const portalData = parsePortalData(root);
   * console.log(JSON.stringify(portalData, null, 2));
   */
  const parsePortalData = (rootEl) => {
    if (!rootEl) return {};
  
    // Select the cards by their IDs (adjust these selectors as needed)
    const garantsCard = rootEl.querySelector("#ProgramGarantsCard");
    const akreditaceCard = rootEl.querySelector("#ProgramAkreditaceCard");
    const subjectsCard = rootEl.querySelector("#ProgramPredmetsCard");
    // Assume groups are contained within an element with id "StudiumSkupinaProgram"
    const groupsCard = rootEl.querySelector("#StudiumSkupinaProgram");
  
    const garants = parseGarantsCard(garantsCard);
    const akreditace = parseAkreditaceCard(akreditaceCard);
    const subjects = parseSubjectsCard(subjectsCard);
    const groups = parseGroupsCard(groupsCard);
  
    return { garants, akreditace, subjects, groups };
  };
  
/**
 * Extracts all program information from the given HTML fragment.
 *
 * @param {string} htmlText - The HTML string containing the program info.
 * @returns {object} An object containing teacher, contact, membership, and HAP information.
 */
export const extractProgramInfoFromHTML = (htmlText) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    return parsePortalData(doc)
}

/**
 * Asynchronous Redux Thunk action that fetches program data from a remote endpoint,
 * extracts the program information from the returned HTML, and returns the parsed program info.
 *
 * @param {Object} payload - The input payload.
 * @param {string} payload.program - A program identifier (currently not used in the fetch, but may be used for future customization).
 * @returns {Function} A thunk function that accepts dispatch and getState, and returns a Promise that resolves to an object containing the program information.
 *
 * @example
 * dispatch(ReadProgramAsyncAction({ program: 'someProgramId' }))
 *   .then(programInfo => {
 *     console.log("Extracted program info:", programInfo);
 *   })
 *   .catch(error => {
 *     console.error("Error reading program info:", error);
 *   });
 */
export const ReadProgramAsyncAction = ({program}) => async (dispatch, getState) => {
    const baseUrl = ProgramURI
    const fetchParams = { method: "GET" }
    const fullUrl = buildUrlWithQueryParams(baseUrl, {uic: program?.uic})
    console.log(`ReadProgramAsyncAction: ${JSON.stringify(program)} = ${fullUrl}`)
    const response = await fetch(fullUrl, fetchParams)
    const responseHTML = await response.text()
    console.log(`ReadProgramAsyncAction: ${responseHTML}`)
    const newprogram = {...program, ...extractProgramInfoFromHTML(responseHTML)}
    console.log(`ReadProgramAsyncAction: ${JSON.stringify(newprogram)}`)
    // here dispatch to store

    // newprogram.name = newprogram?.teacher?.name

    return newprogram
}