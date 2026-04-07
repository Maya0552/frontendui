/**
 * A component for displaying the `scalar` attribute of an section entity.
 *
 * This component checks if the `scalar` attribute exists on the `section` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the SectionScalarAttribute component.
 * @param {Object} props.section - The object representing the section entity.
 * @param {*} [props.section.scalar] - The scalar attribute of the section entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const sectionEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <SectionScalarAttribute section={sectionEntity} />
 */
export const SectionScalarAttribute = ({section}) => {
    const {scalar} = section
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}