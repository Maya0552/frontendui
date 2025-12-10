import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

const LinkFragmentStr = `
fragment Link on GQLModel {
  __typename
  id
  lastchange
  name
  nameEn
}
`

const MediumFragmentStr = `
fragment Medium on GQLModel {
  ...Link
}
`

const LargeFragmentStr = `
fragment Large on GQLModel {
  ...Medium
}
`

export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)
  