import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { SectionCardCapsule } from "./SectionCardCapsule"
import { SectionMediumCard } from "./SectionMediumCard"

/**
 * A large card component for displaying detailed content and layout for an section entity.
 *
 * This component wraps an `SectionCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `SectionMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the SectionLargeCard component.
 * @param {Object} props.section - The object representing the section entity.
 * @param {string|number} props.section.id - The unique identifier for the section entity.
 * @param {string} props.section.name - The name or label of the section entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const sectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <SectionLargeCard section={sectionEntity}>
 *   <p>Additional content for the middle column.</p>
 * </SectionLargeCard>
 */
export const SectionLargeCard = ({section, children}) => {
    return (
        <SectionCardCapsule section={section} >
            <Row>
                <LeftColumn>
                    <SectionMediumCard section={section}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </SectionCardCapsule>
    )
}
