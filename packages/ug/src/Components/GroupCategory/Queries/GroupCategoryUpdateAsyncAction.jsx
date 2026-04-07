import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { GroupCategoryLargeFragment } from "./GroupCategoryFragments";

export const GroupCategoryUpdateMutation = createQueryStrLazy(
`mutation GroupCategoryUpdateMutation($id: UUID!, $lastchange: DateTime!, $name: String, $nameEn: String) {
    result: groupCategoryUpdate(groupCategory: {id: $id, lastchange: $lastchange, name: $name, nameEn: $nameEn}) {
        ...GroupCategoryLarge
  	}
}`,
    GroupCategoryLargeFragment
)

export const GroupCategoryUpdateAsyncAction = createAsyncGraphQLAction(GroupCategoryUpdateMutation)