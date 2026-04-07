/**
 * A component for displaying the `scalar` attribute of an statemachine entity.
 *
 * This component checks if the `scalar` attribute exists on the `statemachine` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the StateMachineScalarAttribute component.
 * @param {Object} props.statemachine - The object representing the statemachine entity.
 * @param {*} [props.statemachine.scalar] - The scalar attribute of the statemachine entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const statemachineEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <StateMachineScalarAttribute statemachine={statemachineEntity} />
 */
export const StateMachineScalarAttribute = ({statemachine}) => {
    const {scalar} = statemachine
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}