import { buildUrlWithQueryParams } from "../../_Utils";
import { GroupStudyURI } from "../Components";


  /**
   * Extracts all groupstudy information from the given HTML fragment.
   *
   * @param {string} htmlText - The HTML string containing the groupstudy info.
   * @returns {object} An object containing teacher, contact, membership, and HAP information.
   */
  export const extractGroupStudyInfoFromHTML = (htmlText) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlText, 'text/html');
    const groupstudyInfo = {};

  
    return {...groupstudyInfo, id: `GROUPSTUDY(${groupstudyInfo.uic})`};
  };

  
/**
 * Asynchronous Redux Thunk action that fetches groupstudy data from a remote endpoint,
 * extracts the groupstudy information from the returned HTML, and returns the parsed groupstudy info.
 *
 * @param {Object} payload - The input payload.
 * @param {string} payload.groupstudy - A groupstudy identifier (currently not used in the fetch, but may be used for future customization).
 * @returns {Function} A thunk function that accepts dispatch and getState, and returns a Promise that resolves to an object containing the groupstudy information.
 *
 * @example
 * dispatch(ReadGroupStudyAsyncAction({ groupstudy: 'someGroupStudyId' }))
 *   .then(groupstudyInfo => {
 *     console.log("Extracted groupstudy info:", groupstudyInfo);
 *   })
 *   .catch(error => {
 *     console.error("Error reading groupstudy info:", error);
 *   });
 */
export const ReadGroupStudyAsyncAction = ({groupstudy}) => async (dispatch, getState) => {
    const baseUrl = GroupStudyURI
    const fetchParams = { method: "GET" }
    const fullUrl = buildUrlWithQueryParams(baseUrl, {uic: groupstudy?.uic})
    console.log(`ReadGroupStudyAsyncAction: ${JSON.stringify(groupstudy)} = ${fullUrl}`)
    const response = await fetch(fullUrl, fetchParams)
    const responseHTML = await response.text()
    console.log(`ReadGroupStudyAsyncAction: ${responseHTML}`)
    const newgroupstudy = extractGroupStudyInfoFromHTML(responseHTML)
    console.log(`ReadGroupStudyAsyncAction: ${JSON.stringify(newgroupstudy)}`)
    // here dispatch to store

    newgroupstudy.name = newgroupstudy?.teacher?.name

    return newgroupstudy
}