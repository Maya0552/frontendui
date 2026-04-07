import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RequestTypeLargeFragment } from "./RequestTypeFragments";


const RequestTypeInsertMutationStr = `
mutation RequestTypeInsert(
  $id: UUID, 
  $rbacobjectId: UUID!,
	$name: String,
  $statemachineId: UUID!,
  $statemachinename: String!="Stavový automat pro proces ",
  $stateId: UUID,
  $statename: String!="Žadatel"
) {
  result: requesttypeInsert(
    requestType: { 
      id: $id, 
      rbacobjectId: $rbacobjectId,
      name: $name,
      statemachineId: $statemachineId,
      stateId: $stateId
    }) {
    __typename
    ... on InsertError {
      msg
      failed
      code
      location
      input
    }
    ... on RequestTypeGQLModel {
      ...RequestTypeLargeFragment
    }
  }
  
  rbac: rbacObjectInsert(rbacobject: {
    id: $rbacobjectId,
    grouptypeId: "de8654be-e776-4b6e-bb1e-2d5c949aa1eb"
    roles: []
  }) {
    __typename
    ...on InsertError {
      msg
      code
      location
      input
      
    }
    ...on GroupGQLModel {
      id
      name
      grouptypeId
    }
  }
  
  statemachine: statemachineInsert(statemachine: {
    id: $statemachineId,
    rbacobjectId: $rbacobjectId,
    name: $statemachinename,
    states: [
      {
        name: $statename,
        id: $stateId,
        statemachineId: $statemachineId
      }
    ]
  }) {
    __typename
    ...on InsertError {
      msg
      code
      location
      input
    }
    ...on StateMachineGQLModel {
      id
      name   
    }
  }
}`

// fragment RequestTypeLargeFragment on RequestTypeGQLModel {
//   initialForm {
//       __typename
//       id
//       name
//       rbacobject {
//         __typename
//         id
//       }
//     }  
//   rbacobject {
//     __typename
//     id
//   }
// }


const RequestTypeInsertMutation = createQueryStrLazy(RequestTypeInsertMutationStr, RequestTypeLargeFragment)

export const RequestTypeInsertAsyncAction = createAsyncGraphQLAction(RequestTypeInsertMutation)