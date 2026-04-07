import { ChildWrapper, InfiniteScroll } from "@hrbolek/uoisfrontend-shared"
import { RequestCategoryPageReadAsyncAction } from "./Queries/RequestCategoryPageReadAsyncAction"
import { RequestCategoryLink } from "./RequestCategoryLink"


const RequestCategoryVisualiser = ({requestcategory, children}) => {
    return (
        <tr>
            <td>
                <RequestCategoryLink requestcategory={requestcategory}/>
            </td>
            <td>
                <ChildWrapper requestcategory={requestcategory} children={children} />
            </td>
        </tr>
    )
}

const RequestCategoriesVisualiser = ({items, children}) => {
    return (<>
        {items.map(
            requestcategory => <RequestCategoryVisualiser key={requestcategory.id} requestcategory={requestcategory} children={children}/>
        )}
    </>)
}

export const RequestCategoriesTable = ({requestcategories, children}) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>Název</th>
                    <th>Nástroje</th>
                </tr>
            </thead>
            <tbody>
                <InfiniteScroll 
                    preloadedItems={requestcategories}
                    actionParams={{skip: 0, limit: 10}}
                    asyncAction={RequestCategoryPageReadAsyncAction}
                    Visualiser={RequestCategoriesVisualiser}
                >
                    {children}
                </InfiniteScroll>
            </tbody>
        </table>
    )
}