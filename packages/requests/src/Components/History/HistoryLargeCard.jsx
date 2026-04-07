import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { HistoryCardCapsule } from "./HistoryCardCapsule"
import { HistoryMediumCard } from "./HistoryMediumCard"

/**
 * A large card component for displaying detailed content and layout for an history entity.
 *
 * This component wraps an `HistoryCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `HistoryMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the HistoryLargeCard component.
 * @param {Object} props.history - The object representing the history entity.
 * @param {string|number} props.history.id - The unique identifier for the history entity.
 * @param {string} props.history.name - The name or label of the history entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const historyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <HistoryLargeCard history={historyEntity}>
 *   <p>Additional content for the middle column.</p>
 * </HistoryLargeCard>
 */
export const HistoryLargeCard = ({history, children}) => {
    return (
        <HistoryCardCapsule history={history} >
            <Row>
                <LeftColumn>
                    <HistoryMediumCard history={history}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </HistoryCardCapsule>
    )
}
