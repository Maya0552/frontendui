import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { StateMachineLargeFragment, StateMachineLinkFragment } from "@hrbolek/uoisfrontend-ug";

const RequestTypeRead = createQueryStrLazy(`
query RequestTypeRead($id: UUID!) {
  result: requestTypeById(id: $id) {
    ...RequestType
  }
}

fragment RequestType on RequestTypeGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
  groupId
  group {
    ...GroupLink
  }
  templateFormId
  templateForm {
    ...FormLarge
  }
  statemachine {
    ...StateMachineLarge
  }
}

fragment GroupLink on GroupGQLModel {
  __typename
  id
  name
}

fragment FormLarge on FormGQLModel {
  __typename
  id
  name
  state {
    __typename
    id
    name
    readerslistId
  }
  sections {
    __typename
    id
    lastchange
    name
    order
    parts {
      __typename
      id
      lastchange
      name
      order
      items {
        __typename
        lastchange
        id
        name
        value
        order
        type {
          id
          name
        }
      }
    }
  }
}
`,
    StateMachineLargeFragment);

/**
 * An asynchronous action to execute a GraphQL query for reading request category entities.
 *
 * This action is created using `createAsyncGraphQLAction` with the predefined `RequestCategoryPageRead` query.
 * It fetches paginated data for request category entities from the GraphQL API, using optional filter, skip, and limit parameters.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {number} [query_variables.skip] - The number of records to skip (used for pagination).
 * @param {number} [query_variables.limit] - The maximum number of records to fetch (used for pagination).
 * @param {Object} [query_variables.where] - Filters to apply to the query, matching the `RequestCategoryInputFilter` type in the schema.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query and returns the fetched data.
 *
 * @throws {Error} If `query_variables` is not provided or is invalid.
 *
 * @example
 * // Fetch the first 10 request categories with a name filter
 * const queryVariables = {
 *   skip: 0,
 *   limit: 10,
 *   where: { name: "CategoryName" },
 * };
 *
 * dispatch(RequestCategoryPageReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched request categories:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching request categories:", error);
 *   });
 */

export const RequestTypeReadAsyncAction = createAsyncGraphQLAction(
  RequestTypeRead
);
