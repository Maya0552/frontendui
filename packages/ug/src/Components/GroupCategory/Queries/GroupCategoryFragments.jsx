import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

export const GroupCategoryLargeFragment = createQueryStrLazy(
`fragment GroupCategoryLarge on GroupCategoryGQLModel {
    __typename
    id
    lastchange
    name
    nameEn
    rbacobject {
        roles {
            userId
            roletype {
                id
                name
            }
        }
    }  
}`    
)

export const GroupCategoryReadQuery = createQueryStrLazy(
`query GroupCategoryReadQuery($id: UUID!) {
    result: groupCategoryById(id: $id) {
        ...GroupCategoryLarge
  	}
}`,
    GroupCategoryLargeFragment
)
