import { AsyncClickHandler, ButtonWithDialog, Input } from '@hrbolek/uoisfrontend-shared';
import { StateInsertAsyncAction } from './Queries/StateInsertAsyncAction';
import { StateDeleteAsyncAction } from './Queries/StateDeleteAsyncAction';

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
 * @param {Object} [props.state={}] - The initial parameters for the state insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.state.name] - The default value for the "Název" field.
 * @param {string} [props.state.name_en] - The default value for the "Anglický název" field.
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
export const DeleteStateButton = ({ children, state, onDone = (state) => null, ...props }) => {
    return (
        <AsyncClickHandler
            asyncAction={StateDeleteAsyncAction}
            defaultParams={state}
            loadingMsg={"Odstraňuji stav"}
            onClick={() => onDone(state)}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Chcete odebrat stav?" {...props} params={state}>
                <h2>{state?.name} ({state?.nameEn})</h2>
                <p>{JSON.stringify(state)}</p>
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
