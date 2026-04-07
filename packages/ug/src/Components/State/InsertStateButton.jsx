import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { StateInsertAsyncAction } from './Queries/StateInsertAsyncAction';
import { StateMediumEditableContent } from './StateMediumEditableContent';

/**
 * InsertStateButton Component
 *
 * A reusable button component for inserting a new "state" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the InsertStateButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the state insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newState) => null] - Callback executed after the state is successfully inserted.
 *                                                      Receives the new state as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleStateInserted = (newState) => {
 *         console.log("State inserted:", newState);
 *     };
 *
 *     return (
 *         <InsertStateButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleStateInserted}
 *         >
 *             Add New State
 *         </InsertStateButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for inserting a new state.
 */
export const InsertStateButton = ({ children, params, onDone = (newState) => null, ...props }) => {
    return (
        <AsyncClickHandler
            asyncAction={StateInsertAsyncAction}
            defaultParams={params}
            loadingMsg={"Vkládám nový stav"}
            onClick={onDone}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Vložit nový stav" {...props} params={params}>
                <StateMediumEditableContent state={params} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
