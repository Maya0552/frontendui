import { buildUrlWithQueryParams } from "../../_Utils";
import { UserURI } from "../Components";

/**
 * Extracts teacher information from a teacher card element.
 *
 * @param {HTMLElement} teacherCard - The DOM element containing teacher info.
 * @returns {object} An object with teacher details (id, name, degree, and department).
 */
const extractTeacherInfo = (teacherCard) => {
    let teacher = {};
  
    // Get the header link which contains teacher's full text and URL.
    const headerLink = teacherCard.querySelector('.card-header-green a');
    if (headerLink) {
      const teacherHref = headerLink.getAttribute('href') || '';
      // Extract teacher ID from URL, e.g. "/PortalOsoba/Vyucujici/id" -> "id"
      const idMatch = teacherHref.match(/\/(\d+)(\/)?$/);
      const teacherId = idMatch ? idMatch[1] : null;
  
      // Split the text by semicolons; e.g.: "FamilyName FirstName; ; title. title. title.;  (id)"
      const parts = headerLink.textContent
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean);
  
      teacher = {
        id: teacherId,
        name: parts[0] || '',
        degree: parts[2] || ''
      };
    }
  
    // Also grab the department info from the teacher card body.
    const deptRow = teacherCard.querySelector('.card-body .row');
    if (deptRow) {
      const label = deptRow.querySelector('.col-auto strong');
      const valueLink = deptRow.querySelector('.col.text-end a');
      if (label && valueLink && label.textContent.includes('Katedra')) {
        teacher.department = valueLink.textContent.trim();
      }
    }
    return teacher;
  };
  
  /**
   * Extracts contact information from a contact card element.
   *
   * @param {HTMLElement} contactCard - The DOM element containing contact info.
   * @returns {object} An object with contact details such as email, phone, area, and location.
   */
  const extractContactInfo = (contactCard) => {
    const contact = {};
    const rows = contactCard.querySelectorAll('.card-body .row');
    rows.forEach((row) => {
      // Try multiple selectors for label and value.
      const labelElem = row.querySelector('.col-auto, .col-md');
      const valueElem = row.querySelector('.col.text-end, .col-md.text-end');
      if (labelElem && valueElem) {
        const label = labelElem.textContent.trim().replace(':', '');
        const value = valueElem.textContent.trim();
        switch (label) {
          case 'E-mail':
            // If there is extra content, take the first part.
            contact.email = value.split(' ')[0];
            break;
          case 'Telefon':
            contact.phone = value;
            break;
          case 'Areál':
            contact.area = value;
            break;
          case 'Budova/Patro/Místnost':
            contact.location = value;
            break;
          default:
            break;
        }
      }
    });
    return contact;
  };
  
  /**
   * Extracts membership information from a membership card element.
   *
   * @param {HTMLElement} membershipCard - The DOM element containing membership info.
   * @returns {object} An object with membership details such as faculty and department.
   */
  const extractMembershipInfo = (membershipCard) => {
    const membership = {};
    const rows = membershipCard.querySelectorAll('.card-body .row');
    rows.forEach((row) => {
      const labelElem = row.querySelector('.col-auto');
      const valueElem = row.querySelector('.col.text-end a');
      if (labelElem && valueElem) {
        const label = labelElem.textContent.trim().replace(':', '');
        const value = valueElem.textContent.trim();
        if (label === 'Fakulta') {
          membership.faculty = value;
        } else if (label === 'Katedra') {
          membership.department = value;
        }
      }
    });
    return membership;
  };
  
  /**
   * Extracts HAP (term dates) information from a HAP card element.
   *
   * @param {HTMLElement} hapCard - The DOM element containing HAP info.
   * @returns {object} An object with HAP term dates and source information.
   */
  const extractHapInfo = (hapCard) => {
    const hap = {};
    const hapBody = hapCard.querySelector('.card-body');
    if (hapBody) {
      // Each HAP label is in a <strong> followed by a <p>
      const labels = hapBody.querySelectorAll('strong');
      labels.forEach((strongElem) => {
        const label = strongElem.textContent.trim();
        const pElem = strongElem.nextElementSibling;
        if (pElem && pElem.tagName.toLowerCase() === 'p') {
          hap[label] = pElem.textContent.trim();
        }
      });
    }
    // Capture the footer text as source information.
    const hapFooter = hapCard.querySelector('.card-footer');
    if (hapFooter) {
      hap.source = hapFooter.textContent.trim();
    }
    return hap;
  };
  
  /**
   * Extracts all user information from the given HTML fragment.
   *
   * @param {string} htmlText - The HTML string containing the user info.
   * @returns {object} An object containing teacher, contact, membership, and HAP information.
   */
  export const extractUserInfoFromHTML = (htmlText) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const userInfo = {};
  
    const teacherCard = doc.getElementById('VyucujiciCard');
    if (teacherCard) {
      userInfo.teacher = extractTeacherInfo(teacherCard);
    }
  
    const contactCard = doc.getElementById('VyucujiciKontaktniInformaceCard');
    if (contactCard) {
      userInfo.contact = extractContactInfo(contactCard);
    }
  
    const membershipCard = doc.getElementById('VyucujiciClenstviCar');
    if (membershipCard) {
      userInfo.membership = extractMembershipInfo(membershipCard);
    }
  
    const hapCard = doc.getElementById('VyucujiciHapCard');
    if (hapCard) {
      userInfo.hap = extractHapInfo(hapCard);
    }
  
    return {...userInfo, uco: userInfo.teacher.id, id: `USER(${userInfo.teacher.id})`};
  };

  
/**
 * Asynchronous Redux Thunk action that fetches user data from a remote endpoint,
 * extracts the user information from the returned HTML, and returns the parsed user info.
 *
 * @param {Object} payload - The input payload.
 * @param {string} payload.user - A user identifier (currently not used in the fetch, but may be used for future customization).
 * @returns {Function} A thunk function that accepts dispatch and getState, and returns a Promise that resolves to an object containing the user information.
 *
 * @example
 * dispatch(ReadUserAsyncAction({ user: 'someUserId' }))
 *   .then(userInfo => {
 *     console.log("Extracted user info:", userInfo);
 *   })
 *   .catch(error => {
 *     console.error("Error reading user info:", error);
 *   });
 */
export const ReadUserAsyncAction = ({user}) => async (dispatch, getState) => {
    const baseUrl = UserURI
    const fetchParams = { method: "GET" }
    const fullUrl = buildUrlWithQueryParams(baseUrl, {uco: user?.uco})
    console.log(`ReadUserAsyncAction: ${JSON.stringify(user)} = ${fullUrl}`)
    const response = await fetch(fullUrl, fetchParams)
    const responseHTML = await response.text()
    console.log(`ReadUserAsyncAction: ${responseHTML}`)
    const newuser = extractUserInfoFromHTML(responseHTML)
    console.log(`ReadUserAsyncAction: ${JSON.stringify(newuser)}`)
    // here dispatch to store

    newuser.name = newuser?.teacher?.name

    return newuser
}