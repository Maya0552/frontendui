import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { PartCardCapsule } from "./PartCardCapsule"
import { PartMediumCard } from "./PartMediumCard"

/**
 * A large card component for displaying detailed content and layout for an part entity.
 *
 * This component wraps an `PartCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `PartMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the PartLargeCard component.
 * @param {Object} props.part - The object representing the part entity.
 * @param {string|number} props.part.id - The unique identifier for the part entity.
 * @param {string} props.part.name - The name or label of the part entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const partEntity = { id: 123, name: "Sample Entity" };
 * 
 * <PartLargeCard part={partEntity}>
 *   <p>Additional content for the middle column.</p>
 * </PartLargeCard>
 */
export const PartLargeCard = ({part, children}) => {
    return (
        <PartCardCapsule part={part} >
            <Row>
                <LeftColumn>
                    <PartMediumCard part={part}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </PartCardCapsule>
    )
}
