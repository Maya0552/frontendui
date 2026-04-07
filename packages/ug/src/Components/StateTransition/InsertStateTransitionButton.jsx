import { useRef } from 'react'
import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { StateTransitionInsertAsyncAction } from './Queries/StateTransitionInsertAsyncAction';
import { StateTransitionMediumEditableContent } from './StateTransitionMediumEditableContent';

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
 * @param {Object} [props.params={}] - The initial parameters for the statetransition insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
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
export const InsertStateTransitionButton = ({ children, params, onDone = (newStateTransition) => null, ...props }) => {
    const ref = useRef(crypto.randomUUID())
    return (
        <AsyncClickHandler
            asyncAction={StateTransitionInsertAsyncAction}
            defaultParams={params}
            loadingMsg={"Vkládám novou změnu stavu"}
            onClick={onDone}
        >
            {/* <div>{JSON.stringify(ref)}</div>            */}
            <ButtonWithDialog buttonLabel={children} dialogTitle="Vložit novou změnu stavu" {...props} params={params}>
                <StateTransitionMediumEditableContent statetransition={params} />
            </ButtonWithDialog>
            {/* <div>{JSON.stringify(params)}</div> */}
        </AsyncClickHandler>
    );
};
