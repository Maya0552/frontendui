import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const UserLinkFragment = createQueryStrLazy(
`fragment UserLink on UserGQLModel {
  __typename
  id
  fullname
  email
  name
  surname
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  startdate
  enddate
}`    
)

const GroupLinkFragment = createQueryStrLazy(
`fragment GroupLink on GroupGQLModel {
  __typename
  id
  name
  email
  startdate
  enddate
  valid
  nameEn
  abbreviation
  grouptypeId
  createdbyId
  rbacobjectId
}`    
)

export const MembershipMediumFragment = createQueryStrLazy(
`fragment Membership on MembershipGQLModel {
  __typename
  user { ...UserLink }
  group { ...GroupLink }
  startdate
  enddate
  valid
  createdbyId
  rbacobjectId
}`,
    UserLinkFragment, GroupLinkFragment
)

