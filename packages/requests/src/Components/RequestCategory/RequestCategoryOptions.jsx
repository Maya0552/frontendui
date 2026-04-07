import { createAsyncGraphQLAction, transformAndCacheGraphQLVectorResult, updateItemsFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared";
import { Options } from "@hrbolek/uoisfrontend-shared"
import { RequestCategoryPageRead } from "./Queries/RequestCategoryPageReadAsyncAction";

const CacheId = "3d66bf53-eca3-4695-844f-bee64a8a2269"

const RequestCategoryPageReadAsyncAction = createAsyncGraphQLAction(
    RequestCategoryPageRead,
    updateItemsFromGraphQLResult,
    transformAndCacheGraphQLVectorResult(CacheId) 
);

export const RequestCategoryOptions = ({params}) => {
    return (<>
        <Options asyncAction={RequestCategoryPageReadAsyncAction} params={params}/>    
    </>)
}