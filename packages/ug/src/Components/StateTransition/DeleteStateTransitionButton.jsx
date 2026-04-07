import { AsyncClickHandler, ButtonWithDialog, Input } from '@hrbolek/uoisfrontend-shared';
import { StateTransitionInsertAsyncAction } from './Queries/StateTransitionInsertAsyncAction';
import { StateTransitionDeleteAsyncAction } from './Queries/StateTransitionDeleteAsyncAction';

/**
 * InsertStateTransitionButton Component
 *
 * A reusable button component for inserting a new "statetransition" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the InsertStateTransitionButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.statetransition={}] - The initial parameters for the statetransition insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.statetransition.name] - The default value for the "Název" field.
 * @param {string} [props.statetransition.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newStateTransition) => null] - Callback executed after the statetransition is successfully inserted.
 *                                                      Receives the new statetransition as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleStateTransitionInserted = (newStateTransition) => {
 *         console.log("StateTransition inserted:", newStateTransition);
 *     };
 *
 *     return (
 *         <InsertStateTransitionButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleStateTransitionInserted}
 *         >
 *             Add New StateTransition
 *         </InsertStateTransitionButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for inserting a new statetransition.
 */
export const DeleteStateTransitionButton = ({ children, statetransition, onDone = (statetransition) => null, ...props }) => {
    return (
        <AsyncClickHandler
            asyncAction={StateTransitionDeleteAsyncAction}
            defaultParams={statetransition}
            loadingMsg={"Odstraňuji změnu stavu"}
            onClick={() => onDone(statetransition)}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Chcete odebrat změnu stavu?" {...props} params={statetransition}>
                <h2>{statetransition?.name} ({statetransition?.nameEn})</h2>
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
