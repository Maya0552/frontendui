import { createAsyncGraphQLAction, transformAndCacheGraphQLVectorResult } from "@hrbolek/uoisfrontend-gql-shared";
import { RoleTypeReadPageQuery } from "./RoleTypeFragments";


export const RoleTypeReadPageAsyncActionCacheId = "abe2d2d1-06dd-475f-a096-99b4eeeda69c"
export const RoleTypeReadPageAsyncAction = createAsyncGraphQLAction(
    RoleTypeReadPageQuery,
    transformAndCacheGraphQLVectorResult(RoleTypeReadPageAsyncActionCacheId)
)