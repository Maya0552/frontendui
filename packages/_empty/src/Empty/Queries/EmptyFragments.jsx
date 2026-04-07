import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

export const EmptyLinkFragment = createQueryStrLazy(
`
fragment EmptyLink on EmptyGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
}
`)


export const EmptyMediumFragment = createQueryStrLazy(
`
fragment EmptyMedium on EmptyGQLModel {
  ...EmptyLink
}
`, EmptyLinkFragment)

export const EmptyLargeFragment = createQueryStrLazy(
`
fragment EmptyLarge on EmptyGQLModel {
  ...EmptyMedium
}
`, EmptyMediumFragment)
  