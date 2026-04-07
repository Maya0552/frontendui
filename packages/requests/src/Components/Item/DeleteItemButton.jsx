import { AsyncClickHandler, ButtonWithDialog, Input } from '@hrbolek/uoisfrontend-shared';
import { ItemDeleteAsyncAction } from './Queries/ItemDeleteAsyncAction';

/**
 * InsertItemButton Component
 *
 * A reusable button component for inserting a new "item" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the InsertItemButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the item insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newItem) => null] - Callback executed after the item is successfully inserted.
 *                                                      Receives the new item as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleItemInserted = (newItem) => {
 *         console.log("Item inserted:", newItem);
 *     };
 *
 *     return (
 *         <InsertItemButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleItemInserted}
 *         >
 *             Add New Item
 *         </InsertItemButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for inserting a new item.
 */
export const DeleteItemButton = ({ children, item, onDone = (item) => null, ...props }) => {
    return (
        <AsyncClickHandler
            asyncAction={ItemDeleteAsyncAction}
            defaultParams={item}
            loadingMsg={"Odstraňuji položku"}
            onClick={() => onDone(item)}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Chcete odebrat položku?" {...props} params={item}>
                <h2>{item?.name} ({item?.nameEn})</h2>
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
