import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { StateUpdateAsyncAction } from './Queries/StateUpdateAsyncAction';
import { StateMediumEditableContent } from './StateMediumEditableContent';

/**
 * UpdateStateButton Component
 *
 * A reusable button component for updateing a new "state" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the UpdateStateButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the state updateion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newState) => null] - Callback executed after the state is successfully updateed.
 *                                                      Receives the new state as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleStateUpdateed = (newState) => {
 *         console.log("State updateed:", newState);
 *     };
 *
 *     return (
 *         <UpdateStateButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleStateUpdateed}
 *         >
 *             Add New State
 *         </UpdateStateButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for updateing a new state.
 */
export const UpdateStateButton = ({ children, state, onDone = (state) => null, ...props }) => {
    // console.log(`UpdateStateButton.state`, state)
    const handleClick = (state) => {
        // console.log(`UpdateStateButton.state`, state)
        onDone(state)
    }
    return (
        <AsyncClickHandler
            asyncAction={StateUpdateAsyncAction}
            defaultParams={state}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Upravit část" {...props} params={state}>
                <StateMediumEditableContent state={state} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
