/**
 * A component for displaying the `scalar` attribute of an history entity.
 *
 * This component checks if the `scalar` attribute exists on the `history` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the HistoryScalarAttribute component.
 * @param {Object} props.history - The object representing the history entity.
 * @param {*} [props.history.scalar] - The scalar attribute of the history entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const historyEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <HistoryScalarAttribute history={historyEntity} />
 */
export const HistoryScalarAttribute = ({history}) => {
    const {scalar} = history
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}