import { AsyncClickHandler, ButtonWithDialog, Input } from '@hrbolek/uoisfrontend-shared';
import { RequestCategoryInsertAsyncAction } from './Queries/RequestCategoryInsertAsyncAction';
import { RequestCategoryDeleteAsyncAction } from './Queries/RequestCategoryDeleteAsyncAction';

/**
 * DeleteRequestCategoryButton Component
 *
 * A reusable button component for inserting a new "requestcategory" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the DeleteRequestCategoryButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the requestcategory insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newRequestCategory) => null] - Callback executed after the requestcategory is successfully inserted.
 *                                                      Receives the new requestcategory as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleRequestCategoryInserted = (newRequestCategory) => {
 *         console.log("RequestCategory inserted:", newRequestCategory);
 *     };
 *
 *     return (
 *         <DeleteRequestCategoryButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleRequestCategoryInserted}
 *         >
 *             Add New RequestCategory
 *         </DeleteRequestCategoryButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for inserting a new requestcategory.
 */
export const DeleteRequestCategoryButton = ({ children, requestcategory, onDone = (requestcategory) => null, ...props }) => {
    return (
        <AsyncClickHandler
            asyncAction={RequestCategoryDeleteAsyncAction}
            defaultParams={requestcategory}
            loadingMsg={"Odstraňuji kategorii"}
            onClick={() => onDone(requestcategory)}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Chcete odebrat kategorii?" {...props} params={requestcategory}>
                <h2>{requestcategory?.name} ({requestcategory?.nameEn})</h2>
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
