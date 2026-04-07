import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";
import { RoleTypeListReadQuery } from "./RoleTypeListFraments";

export const RoleTypeListReadAsyncAction = createAsyncGraphQLAction(
    RoleTypeListReadQuery
)