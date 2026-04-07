import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { RequestTypeUpdateAsyncAction } from './Queries/RequestTypeUpdateAsyncAction';
import { RequestTypeMediumEditableContent } from './RequestTypeMediumEditableContent';

/**
 * UpdateRequestTypeButton Component
 *
 * A reusable button component for updateing a new "requesttype" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the UpdateRequestTypeButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the requesttype updateion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newRequestType) => null] - Callback executed after the requesttype is successfully updateed.
 *                                                      Receives the new requesttype as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleRequestTypeUpdateed = (newRequestType) => {
 *         console.log("RequestType updateed:", newRequestType);
 *     };
 *
 *     return (
 *         <UpdateRequestTypeButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleRequestTypeUpdateed}
 *         >
 *             Add New RequestType
 *         </UpdateRequestTypeButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for updateing a new requesttype.
 */
export const UpdateRequestTypeButton = ({ children, requesttype, onDone = (requesttype) => null, ...props }) => {
    // console.log(`UpdateRequestTypeButton.requesttype`, requesttype)
    const handleClick = (requesttype) => {
        // console.log(`UpdateRequestTypeButton.requesttype`, requesttype)
        onDone(requesttype)
    }
    return (
        <AsyncClickHandler
            asyncAction={RequestTypeUpdateAsyncAction}
            defaultParams={requesttype}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Upravit část" {...props} params={requesttype}>
                <RequestTypeMediumEditableContent requesttype={requesttype} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
