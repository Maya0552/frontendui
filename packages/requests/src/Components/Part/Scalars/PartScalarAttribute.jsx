/**
 * A component for displaying the `scalar` attribute of an part entity.
 *
 * This component checks if the `scalar` attribute exists on the `part` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the PartScalarAttribute component.
 * @param {Object} props.part - The object representing the part entity.
 * @param {*} [props.part.scalar] - The scalar attribute of the part entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const partEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <PartScalarAttribute part={partEntity} />
 */
export const PartScalarAttribute = ({part}) => {
    const {scalar} = part
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}