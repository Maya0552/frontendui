import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { GroupInsertAsyncAction } from './Queries/GroupInsertAsyncAction';
import { GroupMediumEditableContent } from './GroupMediumEditableContent';

/**
 * InsertGroupButton Component
 *
 * A reusable button component for inserting a new "group" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the InsertGroupButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the group insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newGroup) => null] - Callback executed after the group is successfully inserted.
 *                                                      Receives the new group as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleGroupInserted = (newGroup) => {
 *         console.log("Group inserted:", newGroup);
 *     };
 *
 *     return (
 *         <InsertGroupButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleGroupInserted}
 *         >
 *             Add New Group
 *         </InsertGroupButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for inserting a new group.
 */
export const InsertGroupButton = ({ children, params, onDone = (newGroup) => null, ...props }) => {
    return (
        <AsyncClickHandler
            asyncAction={GroupInsertAsyncAction}
            defaultParams={params}
            loadingMsg={"Vkládám novou skupinu"}
            onClick={onDone}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Vložit novou skupinu" {...props} params={params}>
                <GroupMediumEditableContent group={params} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
