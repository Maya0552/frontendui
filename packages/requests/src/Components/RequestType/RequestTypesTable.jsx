import { RequestTypePageReadAsyncAction } from "../../Pages/Queries/RequestTypePageReadAsyncAction"

const RequestTypeVisualiser = ({requesttype, children}) => {
    return (
        <tr>
            <td>
                {/* <RequestCategoryLink requestcategory={requestcategory}/> */}
            </td>
            <td>
                <ChildWrapper requesttype={requesttype} children={children} />
            </td>
        </tr>
    )
}

const RequestTypesVisualiser = ({items, children}) => {
    return (<>
        {items.map(
            requesttype => <RequestTypeVisualiser key={requesttype.id} requestcategory={requestcategory} children={children}/>
        )}
    </>)
}

export const RequestTypesTable = ({requesttypes, children}) => {
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
                    preloadedItems={requesttypes}
                    actionParams={{skip: 0, limit: 10}}
                    asyncAction={RequestTypePageReadAsyncAction}
                    Visualiser={RequestTypesVisualiser}
                >
                    {children}
                </InfiniteScroll>
            </tbody>
        </table>
    )
}