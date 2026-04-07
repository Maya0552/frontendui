import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const FormLinkFragment = createQueryStrLazy(
`
fragment FormLink on FormGQLModel {
  __typename
  id
  name
  nameEn
`    
)

export const FormLargeFragment = createQueryStrLazy(
`
fragment FormLarge on FormGQLModel {
  ...FormLink
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
}`,
    FormLinkFragment
)