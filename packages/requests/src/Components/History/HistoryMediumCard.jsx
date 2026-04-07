import { PersonFill } from "react-bootstrap-icons"
import { HistoryLink } from "./HistoryLink"
import { HistoryCardCapsule } from "./HistoryCardCapsule"
import { HistoryMediumContent } from "./HistoryMediumContent"

/**
 * A card component that displays detailed content for an history entity.
 *
 * This component combines `HistoryCardCapsule` and `HistoryMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the history entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the HistoryMediumCard component.
 * @param {Object} props.history - The object representing the history entity.
 * @param {string|number} props.history.id - The unique identifier for the history entity.
 * @param {string} props.history.name - The name or label of the history entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const historyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <HistoryMediumCard history={historyEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </HistoryMediumCard>
 */
export const HistoryMediumCard = ({history, children}) => {
    return (
        <HistoryCardCapsule title={<><PersonFill /> <HistoryLink history={history} /></>}>
            <HistoryMediumContent history={history}>
                {children}
            </HistoryMediumContent>
        </HistoryCardCapsule>
    )
}
