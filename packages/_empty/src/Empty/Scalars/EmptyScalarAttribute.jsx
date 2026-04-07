/**
 * A component for displaying the `scalar` attribute of an empty entity.
 *
 * This component checks if the `scalar` attribute exists on the `empty` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the EmptyScalarAttribute component.
 * @param {Object} props.empty - The object representing the empty entity.
 * @param {*} [props.empty.scalar] - The scalar attribute of the empty entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const emptyEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <EmptyScalarAttribute empty={emptyEntity} />
 */
export const EmptyScalarAttribute = ({empty}) => {
    const {scalar} = empty
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}