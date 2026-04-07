import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { StateMachineUpdateAsyncAction } from './Queries/StateMachineUpdateAsyncAction';
import { StateMachineMediumEditableContent } from './StateMachineMediumEditableContent';

/**
 * UpdateStateMachineButton Component
 *
 * A reusable button component for updateing a new "statemachine" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the UpdateStateMachineButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the statemachine updateion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newStateMachine) => null] - Callback executed after the statemachine is successfully updateed.
 *                                                      Receives the new statemachine as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleStateMachineUpdateed = (newStateMachine) => {
 *         console.log("StateMachine updateed:", newStateMachine);
 *     };
 *
 *     return (
 *         <UpdateStateMachineButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleStateMachineUpdateed}
 *         >
 *             Add New StateMachine
 *         </UpdateStateMachineButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for updateing a new statemachine.
 */
export const UpdateStateMachineButton = ({ children, statemachine, onDone = (statemachine) => null, ...props }) => {
    // console.log(`UpdateStateMachineButton.statemachine`, statemachine)
    const handleClick = (statemachine) => {
        // console.log(`UpdateStateMachineButton.statemachine`, statemachine)
        onDone(statemachine)
    }
    return (
        <AsyncClickHandler
            asyncAction={StateMachineUpdateAsyncAction}
            defaultParams={statemachine}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Upravit část" {...props} params={statemachine}>
                <StateMachineMediumEditableContent statemachine={statemachine} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
