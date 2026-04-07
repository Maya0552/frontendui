/**
 * A component for displaying the `scalar` attribute of an form entity.
 *
 * This component checks if the `scalar` attribute exists on the `form` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the FormScalarAttribute component.
 * @param {Object} props.form - The object representing the form entity.
 * @param {*} [props.form.scalar] - The scalar attribute of the form entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const formEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <FormScalarAttribute form={formEntity} />
 */
export const FormScalarAttribute = ({form}) => {
    const {scalar} = form
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}