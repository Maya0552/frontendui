import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const RBACObjectLargeFragment = createQueryStrLazy(`
fragment RBACObjectLargeFragment on RBACObjectGQLModel {
  __typename
  id
  currentUserRoles {
    __typename
    id
    roletype {
      __typename
      id
      name
    }
    
    groupId
    lastchange
  }
}`)