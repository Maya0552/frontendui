import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { ItemUpdateAsyncAction } from './Queries/ItemUpdateAsyncAction';
import { ItemMediumEditableContent } from './ItemMediumEditableContent';

/**
 * UpdateItemButton Component
 *
 * A reusable button component for updateing a new "item" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the UpdateItemButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the item updateion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newItem) => null] - Callback executed after the item is successfully updateed.
 *                                                      Receives the new item as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleItemUpdateed = (newItem) => {
 *         console.log("Item updateed:", newItem);
 *     };
 *
 *     return (
 *         <UpdateItemButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleItemUpdateed}
 *         >
 *             Add New Item
 *         </UpdateItemButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for updateing a new item.
 */
export const UpdateItemButton = ({ children, item, onDone = (item) => null, ...props }) => {
    // console.log(`UpdateItemButton.item`, item)
    const handleClick = (item) => {
        // console.log(`UpdateItemButton.item`, item)
        onDone(item)
    }
    return (
        <AsyncClickHandler
            asyncAction={ItemUpdateAsyncAction}
            defaultParams={item}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Upravit položku" {...props} params={item}>
                <ItemMediumEditableContent item={item} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
