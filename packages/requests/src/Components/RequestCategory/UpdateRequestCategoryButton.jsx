import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { RequestCategoryUpdateAsyncAction } from './Queries/RequestCategoryUpdateAsyncAction';
import { RequestCategoryMediumEditableContent } from './RequestCategoryMediumEditableContent';

/**
 * UpdateRequestCategoryButton Component
 *
 * A reusable button component for updateing a new "requestcategory" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the UpdateRequestCategoryButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the requestcategory updateion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newRequestCategory) => null] - Callback executed after the requestcategory is successfully updateed.
 *                                                      Receives the new requestcategory as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleRequestCategoryUpdateed = (newRequestCategory) => {
 *         console.log("RequestCategory updateed:", newRequestCategory);
 *     };
 *
 *     return (
 *         <UpdateRequestCategoryButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleRequestCategoryUpdateed}
 *         >
 *             Add New RequestCategory
 *         </UpdateRequestCategoryButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for updateing a new requestcategory.
 */
export const UpdateRequestCategoryButton = ({ children, requestcategory, onDone = (requestcategory) => null, ...props }) => {
    // console.log(`UpdateRequestCategoryButton.requestcategory`, requestcategory)
    const handleClick = (requestcategory) => {
        // console.log(`UpdateRequestCategoryButton.requestcategory`, requestcategory)
        onDone(requestcategory)
    }
    return (
        <AsyncClickHandler
            asyncAction={RequestCategoryUpdateAsyncAction}
            defaultParams={requestcategory}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Upravit část" {...props} params={requestcategory}>
                <RequestCategoryMediumEditableContent requestcategory={requestcategory} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
