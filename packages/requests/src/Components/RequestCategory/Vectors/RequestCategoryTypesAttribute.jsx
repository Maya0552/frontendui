import { RequestTypeChildren } from "../../RequestType/RequestTypeChildren"

/**
 * RequestCategoryTypesAttribute Component
 *
 * A React component that renders a list of `RequestTypeChildren` components, passing down each 
 * `requesttype` from the provided `requestcategory` and rendering the given children for each type.
 *
 * @component
 * @param {Object} props - The props for the RequestCategoryTypesAttribute component.
 * @param {Object} props.requestcategory - The request category object containing a list of types.
 * @param {Array} [props.requestcategory.types=[]] - An array of request types within the category.
 * @param {React.ReactNode} props.children - The children elements to render for each `RequestTypeChildren`.
 *
 * @returns {JSX.Element} A fragment containing a list of `RequestTypeChildren` components.
 *
 * @example
 * // Example usage:
 * const requestCategory = {
 *   types: [
 *     { id: 1, name: "Type A" },
 *     { id: 2, name: "Type B" },
 *   ],
 * };
 *
 * <RequestCategoryTypesAttribute requestcategory={requestCategory}>
 *   {(requesttype) => <div>{requesttype.name}</div>}
 * </RequestCategoryTypesAttribute>
 *
 * // Result: Renders two `RequestTypeChildren` components, each passing its type and rendering the child.
 */
export const RequestCategoryTypesAttribute = ({ requestcategory, children }) => {
    const types = requestcategory.requestTypes || [];
    return (
        <>
            {types.map((requesttype) => (
                <RequestTypeChildren key={requesttype.id} requesttype={requesttype}>
                    {children}
                </RequestTypeChildren>
            ))}
        </>
    );
};
