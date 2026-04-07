import { Options } from "@hrbolek/uoisfrontend-shared";
import { RequestTypeReadPage } from "./Queries";
import { createAsyncGraphQLAction, transformAndCacheGraphQLVectorResult } from "@hrbolek/uoisfrontend-gql-shared";

const CacheId = "b2cb37bc-7a54-41c4-aba4-f3a537110a5c"
const RequestTypeReadPageAsyncAction = createAsyncGraphQLAction(
    RequestTypeReadPage,
    transformAndCacheGraphQLVectorResult(CacheId) 
);

export const RequestTypeOptions = ({params, shouldFetch}) => <Options asyncAction={RequestTypeReadPageAsyncAction} params={params} shouldFetch={shouldFetch}/>