import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { LargeFragment } from "./Fragments";
import { createAsyncGraphQLAction2 } from "../../../../dynamic/src/Core/createAsyncGraphQLAction2";

const ReadQueryStr = `
query fullrequesttypeById($id: UUID!) {
  fullrequesttypeById: requesttypeById(id: $id) {
    ...RequestTypeGQLModel
    ...Large
  }
}

fragment RequestTypeGQLModel on RequestTypeGQLModel {
  __typename
  id
  name
  lastchange
  changedby { __typename id fullname }
  
  initialFormId
  initialForm { ...DigitalFormGQLModel }
  
  statemachineId
  statemachine { ...StateMachineGQLModel }
}

fragment DigitalFormGQLModel on DigitalFormGQLModel {
  __typename
  id
  name
  lastchange
  changedby { __typename id fullname }
  
  state {
    __typename
    id
    name
    statemachine { ...StateMachineGQLModel }
  }
  
  sections {
    ...DigitalFormSectionGQLModel
    fields {
      ...DigitalFormFieldGQLModel
    }
    sections {
      ...DigitalFormSectionGQLModel
      fields {
        ...DigitalFormFieldGQLModel
      }
      sections {
        ...DigitalFormSectionGQLModel
        fields {
          ...DigitalFormFieldGQLModel
        }
        sections {
          ...DigitalFormSectionGQLModel
          fields {
            ...DigitalFormFieldGQLModel
          }
          sections {
            ...DigitalFormSectionGQLModel
            fields {
              ...DigitalFormFieldGQLModel
            }
          }
        }
      }
    }
  }
}

fragment DigitalFormFieldGQLModel on DigitalFormFieldGQLModel {
__typename
  id
  name
  lastchange
  changedby { __typename id fullname }    
  
  label
  labelEn
  flattenFormula
  backendFormula
  computed
  typeId
  formula
  order
  required
  formId
  description
}

fragment DigitalFormSectionGQLModel on DigitalFormSectionGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  name
  path
  label
  labelEn
  description
  sectionId
  formId
  order
  repeatableMin
  repeatableMax
  repeatable   
 
  rbacobject {
    ...RBRoles
  }
  createdby {
    __typename
    id
    fullname
    }

  changedby {
    __typename
    id
    fullname
    }
  form {
  __typename
    id
    name
    }
    section { __typename id name }  
}

fragment StateGQLModel on StateGQLModel {
  __typename
  id
  name
  statemachineId
  lastchange
  changedby { __typename id fullname }
  statemachine { __typename id name }
}

fragment StateTransitionGQLModel on StateTransitionGQLModel {
  __typename
  id
  name
  lastchange
  changedby { __typename id fullname }
  statemachineId
  sourceId
  targetId
  source { ...StateGQLModel }
  target { ...StateGQLModel }
}

fragment StateMachineGQLModel on StateMachineGQLModel {
  __typename
  id
  name
  lastchange
  changedby { __typename id fullname }
  states(limit: 100) { ...StateGQLModel }
  transitions { ...StateTransitionGQLModel }
}
`

const ReadQuery = createQueryStrLazy(`${ReadQueryStr}`, LargeFragment)

/**
 * An async action for executing a GraphQL query to read  entities.
 *
 * This action is created using `createAsyncGraphQLAction` with a predefined `QueryRead` query.
 * It can be dispatched with query variables to fetch data related to  entities from the GraphQL API.
 *
 * @constant
 * @type {Function}
 *
 * @param {Object} query_variables - The variables for the GraphQL query.
 * @param {string|number} query_variables.id - The unique identifier for the  entity to fetch.
 *
 * @returns {Function} A dispatchable async action that performs the GraphQL query, applies middleware, and dispatches the result.
 *
 * @throws {Error} If `query_variables` is not a valid JSON object.
 *
 * @example
 * // Example usage:
 * const queryVariables = { id: "12345" };
 *
 * dispatch(ReadAsyncAction(queryVariables))
 *   .then((result) => {
 *     console.log("Fetched data:", result);
 *   })
 *   .catch((error) => {
 *     console.error("Error fetching data:", error);
 *   });
 */
// export const ReadAsyncAction = createAsyncGraphQLAction2(ReadQuery, reduceToFirstEntity("result"))
export const ReadFullAsyncAction = createAsyncGraphQLAction2(ReadQuery)