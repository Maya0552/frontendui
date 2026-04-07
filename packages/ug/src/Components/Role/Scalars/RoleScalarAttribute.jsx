/**
 * A component for displaying the `scalar` attribute of an Role entity.
 *
 * This component checks if the `scalar` attribute exists on the `Role` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the RoleScalarAttribute component.
 * @param {Object} props.Role - The object representing the Role entity.
 * @param {*} [props.Role.scalar] - The scalar attribute of the Role entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const RoleEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <RoleScalarAttribute Role={RoleEntity} />
 */
export const RoleScalarAttribute = ({role}) => {
    const {scalar} = role
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}