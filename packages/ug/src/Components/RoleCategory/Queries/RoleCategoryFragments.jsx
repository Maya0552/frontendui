import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RoleTypeFragment } from "../../RoleType/Queries/RoleTypeFragments";

export const RoleCategoryMediumFragment = createQueryStrLazy(
`
fragment RoleCategoryMedium on RoleCategoryGQLModel {
  __typename
  id
  name
  nameEn
  roleTypes {
    ...RoleType
  }
}
`,
    RoleTypeFragment
)

export const RoleCategoryReadPageQuery = createQueryStrLazy(
`
query roleTypePage($skip: Int, $limit: Int, $where: RoleCategoryInputWhereFilter, $orderby: String ="name") {
  roleCategoryPage(skip: $skip, limit: $limit, where:$where, orderby: $orderby) {
    ...RoleCategoryMedium
  }
}

`,
    RoleCategoryMediumFragment    
)