import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared";
import { RoleTypeListAddRoleMutation } from "./RoleTypeListFraments";


export const RoleTypeListAddRoleAsyncAction = createAsyncGraphQLAction(RoleTypeListAddRoleMutation)