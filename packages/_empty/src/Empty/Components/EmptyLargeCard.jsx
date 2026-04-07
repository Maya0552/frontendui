import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { EmptyCardCapsule } from "./EmptyCardCapsule"
import { EmptyMediumCard } from "./EmptyMediumCard"

/**
 * A large card component for displaying detailed content and layout for an empty entity.
 *
 * This component wraps an `EmptyCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `EmptyMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the EmptyLargeCard component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {string|number} props.empty.id - The unique identifier for the empty entity.
 * @param {string} props.empty.name - The name or label of the empty entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <EmptyLargeCard empty={emptyEntity}>
 *   <p>Additional content for the middle column.</p>
 * </EmptyLargeCard>
 */
export const EmptyLargeCard = ({empty, children}) => {
    return (
        <EmptyCardCapsule empty={empty} >
            <Row>
                <LeftColumn>
                    <EmptyMediumCard empty={empty}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </EmptyCardCapsule>
    )
}
