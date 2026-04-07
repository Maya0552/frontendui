import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { HistoryLink } from "./HistoryLink"

/**
 * A specialized card component that displays an `HistoryLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `HistoryLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `history` object.
 *
 * @component
 * @param {Object} props - The props for the HistoryCardCapsule component.
 * @param {Object} props.history - The object representing the history entity.
 * @param {string|number} props.history.id - The unique identifier for the history entity.
 * @param {string} props.history.name - The display name for the history entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { HistoryCardCapsule } from './HistoryCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const historyEntity = { id: 123, name: "Example Entity" };
 *
 * <HistoryCardCapsule history={historyEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </HistoryCardCapsule>
 */
export const HistoryCardCapsule = ({history, children, title=<><PersonFill /> <HistoryLink history={history} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
