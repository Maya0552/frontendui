import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { StateTransitionUpdateAsyncAction } from './Queries/StateTransitionUpdateAsyncAction';
import { StateTransitionMediumEditableContent } from './StateTransitionMediumEditableContent';

/**
 * UpdateStateTransitionButton Component
 *
 * A reusable button component for updateing a new "statetransition" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the UpdateStateTransitionButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the statetransition updateion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newStateTransition) => null] - Callback executed after the statetransition is successfully updateed.
 *                                                      Receives the new statetransition as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleStateTransitionUpdateed = (newStateTransition) => {
 *         console.log("StateTransition updateed:", newStateTransition);
 *     };
 *
 *     return (
 *         <UpdateStateTransitionButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleStateTransitionUpdateed}
 *         >
 *             Add New StateTransition
 *         </UpdateStateTransitionButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for updateing a new statetransition.
 */
export const UpdateStateTransitionButton = ({ children, statetransition, onDone = (statetransition) => null, ...props }) => {
    // console.log(`UpdateStateTransitionButton.statetransition`, statetransition)
    const handleClick = (statetransition) => {
        // console.log(`UpdateStateTransitionButton.statetransition`, statetransition)
        onDone(statetransition)
    }
    return (
        <AsyncClickHandler
            asyncAction={StateTransitionUpdateAsyncAction}
            defaultParams={statetransition}
            loadingMsg={"Ukládám změnu stavu"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Upravit změnu stavu" {...props} params={statetransition}>
                <StateTransitionMediumEditableContent statetransition={statetransition} />
                {/* <div>
                    {JSON.stringify(statetransition)}
                </div> */}
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
