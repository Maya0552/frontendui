import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"
import { StateLargeFragment } from "../../StateMachine"

export * from "../../StateMachine"


export const StateReadQuery = createQueryStrLazy(
`
query StateReadQuery($id: UUID!) {
  result: stateById(id: $id) {
    ...StateLarge
  }
}
  `, StateLargeFragment)

const RoleTypeLink = createQueryStrLazy(
`
fragment RoleTypeLink on RoleTypeGQLModel {
  __typename
  id
  name
  nameEn
}
`  
)

const StatePermissionsFragment = createQueryStrLazy(
`
fragment StatePermissions on StateGQLModel {
  writerslistId
  readerslistId
  readers: roletypes(access: READ) {
    ...RoleTypeLink
  }
  writers: roletypes(access: WRITE) {
    ...RoleTypeLink
  }
}
`,  RoleTypeLink
)

export const StateReadPermissionsQuery = createQueryStrLazy(
`
query StateReadQuery($id: UUID!) {
  result: stateById(id: $id) {
    ...StatePermissions
  }
}
`  ,
    StatePermissionsFragment
)

