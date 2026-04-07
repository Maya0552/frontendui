import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RoleTypeFragment } from "../../RoleType/Queries/RoleTypeFragments";

export const RoleTypeListFragment = createQueryStrLazy(
`
fragment RoleTypeList on RoleTypeListGQLModel {
  __typename
  id
  roletypes {
    ...RoleType
  }
}`,
    RoleTypeFragment
)

export const RoleTypeListAddRoleMutation = createQueryStrLazy(
`
mutation RoleTypeListAddRole($id: UUID!, $type_id: UUID!) {
  result: roleTypeListAddRole(entity: {typeId: $type_id, id: $id }) {
    __typename
    ...on InsertError {
      msg
      failed
      input
    }
    ...RoleTypeList
  }
}
`,
    RoleTypeListFragment
)

export const RoleTypeListRemoveRoleMutation = createQueryStrLazy(
`
mutation RoleTypeListRemoveRole($id: UUID!, $type_id: UUID!) {
  result: roleTypeListRemoveRole(entity: {typeId: $type_id, id: $id }) {
    __typename
    ...on RoleTypeListGQLModelUpdateError {
      msg
      failed
      input
      Entity {
        ...RoleTypeList
      }
    }
  }
}`,
    RoleTypeListFragment
)

export const RoleTypeListReadQuery = createQueryStrLazy(
`
query RoleTypeListRead($id: UUID!) {
  roleTypeListById(id: $id) {
    ...RoleTypeList
  }
}
`,
    RoleTypeListFragment
)