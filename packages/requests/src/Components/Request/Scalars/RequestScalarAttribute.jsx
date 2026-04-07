/**
 * A component for displaying the `scalar` attribute of an request entity.
 *
 * This component checks if the `scalar` attribute exists on the `request` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the RequestScalarAttribute component.
 * @param {Object} props.request - The object representing the request entity.
 * @param {*} [props.request.scalar] - The scalar attribute of the request entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const requestEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <RequestScalarAttribute request={requestEntity} />
 */
export const RequestScalarAttribute = ({request}) => {
    const {scalar} = request
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}