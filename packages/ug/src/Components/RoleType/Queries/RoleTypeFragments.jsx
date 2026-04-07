import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";

export const RoleTypeFragment = createQueryStrLazy(
`
fragment RoleType on RoleTypeGQLModel {
	__typename
  id
  name
  nameEn
}
`    
)

export const RoleTypeReadPageQuery = createQueryStrLazy(
`query roleTypePage($skip: Int, $limit: Int, $where: RoleTypeInputWhereFilter, $orderby: String ="name") {
  roleTypePage(skip: $skip, limit: $limit, where:$where, orderby: $orderby) {
    ...RoleType
  }
}`,

    RoleTypeFragment
)
