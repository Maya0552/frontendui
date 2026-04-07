/**
 * A component for displaying the `scalar` attribute of an semester entity.
 *
 * This component checks if the `scalar` attribute exists on the `semester` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the SemesterScalarAttribute component.
 * @param {Object} props.semester - The object representing the semester entity.
 * @param {*} [props.semester.scalar] - The scalar attribute of the semester entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const semesterEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <SemesterScalarAttribute semester={semesterEntity} />
 */
export const SemesterScalarAttribute = ({semester}) => {
    const {scalar} = semester
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}