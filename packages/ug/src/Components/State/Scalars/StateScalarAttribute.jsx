/**
 * A component for displaying the `scalar` attribute of an state entity.
 *
 * This component checks if the `scalar` attribute exists on the `state` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the StateScalarAttribute component.
 * @param {Object} props.state - The object representing the state entity.
 * @param {*} [props.state.scalar] - The scalar attribute of the state entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const stateEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <StateScalarAttribute state={stateEntity} />
 */
export const StateScalarAttribute = ({state}) => {
    const {scalar} = state
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}