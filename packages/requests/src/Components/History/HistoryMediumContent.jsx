/**
 * A component that displays medium-level content for an history entity.
 *
 * This component renders a label "HistoryMediumContent" followed by a serialized representation of the `history` object
 * and any additional child content. It is designed to handle and display information about an history entity object.
 *
 * @component
 * @param {Object} props - The properties for the HistoryMediumContent component.
 * @param {Object} props.history - The object representing the history entity.
 * @param {string|number} props.history.id - The unique identifier for the history entity.
 * @param {string} props.history.name - The name or label of the history entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `history` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const historyEntity = { id: 123, name: "Sample Entity" };
 * 
 * <HistoryMediumContent history={historyEntity}>
 *   <p>Additional information about the entity.</p>
 * </HistoryMediumContent>
 */
export const HistoryMediumContent = ({history, children}) => {
    return (
        <>
            HistoryMediumContent <br />
            {JSON.stringify(history)}
            {children}
        </>
    )
}
