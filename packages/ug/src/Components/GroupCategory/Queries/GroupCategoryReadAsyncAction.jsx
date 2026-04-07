import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";
import { GroupCategoryReadQuery } from "./GroupCategoryFragments";

export const GroupCategoryReadAsyncAction = createAsyncGraphQLAction(GroupCategoryReadQuery)
