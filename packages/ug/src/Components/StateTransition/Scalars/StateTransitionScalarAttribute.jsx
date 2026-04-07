/**
 * A component for displaying the `scalar` attribute of an statetransition entity.
 *
 * This component checks if the `scalar` attribute exists on the `statetransition` object. If `scalar` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it displays a placeholder message
 * and a JSON representation of the `scalar` attribute.
 *
 * @component
 * @param {Object} props - The props for the StateTransitionScalarAttribute component.
 * @param {Object} props.statetransition - The object representing the statetransition entity.
 * @param {*} [props.statetransition.scalar] - The scalar attribute of the statetransition entity to be displayed, if defined.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `scalar` attribute or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const statetransitionEntity = { scalar: { id: 1, name: "Sample Scalar" } };
 *
 * <StateTransitionScalarAttribute statetransition={statetransitionEntity} />
 */
export const StateTransitionScalarAttribute = ({statetransition}) => {
    const {scalar} = statetransition
    if (typeof scalar === 'undefined') return null
    return (
        <>
            Probably {'<ScalarMediumCard scalar=\{scalar\} />'} <br />
            {JSON.stringify(scalar)}
        </>
    )
}