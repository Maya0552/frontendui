import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";
import { RoleTypeListRemoveRoleMutation } from "./RoleTypeListFraments";

export const RoleTypeListRemoveRoleAsyncAction = createAsyncGraphQLAction(RoleTypeListRemoveRoleMutation)