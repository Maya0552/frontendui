import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { RequestTypeInsertAsyncAction } from './Queries/RequestTypeInsertAsyncAction';
import { RequestTypeMediumEditableContent } from './RequestTypeMediumEditableContent';

/**
 * InsertRequestTypeButton Component
 *
 * A reusable button component for inserting a new "requesttype" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the InsertRequestTypeButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the requesttype insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newRequestType) => null] - Callback executed after the requesttype is successfully inserted.
 *                                                      Receives the new requesttype as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleRequestTypeInserted = (newRequestType) => {
 *         console.log("RequestType inserted:", newRequestType);
 *     };
 *
 *     return (
 *         <InsertRequestTypeButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleRequestTypeInserted}
 *         >
 *             Add New RequestType
 *         </InsertRequestTypeButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for inserting a new requesttype.
 */
export const InsertRequestTypeButton = ({ children, params, onDone = (newRequestType) => null, ...props }) => {
    return (
        <AsyncClickHandler
            asyncAction={RequestTypeInsertAsyncAction}
            defaultParams={params}
            loadingMsg={"Vytvářím nový požadavek"}
            onClick={onDone}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Vytvořit nový požadavek" {...props} params={params}>
                <RequestTypeMediumEditableContent requesttype={params} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
