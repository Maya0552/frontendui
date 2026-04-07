import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { SemesterCardCapsule } from "./SemesterCardCapsule"
import { SemesterMediumCard } from "./SemesterMediumCard"

/**
 * A large card component for displaying detailed content and layout for an semester entity.
 *
 * This component wraps an `SemesterCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `SemesterMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the SemesterLargeCard component.
 * @param {Object} props.semester - The object representing the semester entity.
 * @param {string|number} props.semester.id - The unique identifier for the semester entity.
 * @param {string} props.semester.name - The name or label of the semester entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const semesterEntity = { id: 123, name: "Sample Entity" };
 * 
 * <SemesterLargeCard semester={semesterEntity}>
 *   <p>Additional content for the middle column.</p>
 * </SemesterLargeCard>
 */
export const SemesterLargeCard = ({semester}) => {
    return (
        <SemesterCardCapsule semester={semester} >
            <Row>
                <LeftColumn>
                    <SemesterMediumCard user={user}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </SemesterCardCapsule>
    )
}
