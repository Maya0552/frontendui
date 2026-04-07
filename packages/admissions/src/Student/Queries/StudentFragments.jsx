import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

export const StudentLinkFragment = createQueryStrLazy(
`
fragment StudentLink on StudentGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
}
`)


export const StudentMediumFragment = createQueryStrLazy(
`
fragment StudentMedium on StudentGQLModel {
  ...StudentLink
}
`, StudentLinkFragment)

export const StudentLargeFragment = createQueryStrLazy(
`
fragment StudentLarge on StudentGQLModel {
  ...StudentMedium
}
`, StudentMediumFragment)
  