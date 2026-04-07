import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { GroupUpdateAsyncAction } from './Queries/GroupUpdateAsyncAction';
import { GroupMediumEditableContent } from './GroupMediumEditableContent';

/**
 * UpdateGroupButton Component
 *
 * A reusable button component for updateing a new "group" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the UpdateGroupButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the group updateion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newGroup) => null] - Callback executed after the group is successfully updateed.
 *                                                      Receives the new group as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleGroupUpdateed = (newGroup) => {
 *         console.log("Group updateed:", newGroup);
 *     };
 *
 *     return (
 *         <UpdateGroupButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleGroupUpdateed}
 *         >
 *             Add New Group
 *         </UpdateGroupButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for updateing a new group.
 */
export const UpdateGroupButton = ({ children, group, onDone = (group) => null, ...props }) => {
    // console.log(`UpdateGroupButton.group`, group)
    const handleClick = (group) => {
        // console.log(`UpdateGroupButton.group`, group)
        onDone(group)
    }
    return (
        <AsyncClickHandler
            asyncAction={GroupUpdateAsyncAction}
            defaultParams={group}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Upravit část" {...props} params={group}>
                <GroupMediumEditableContent group={group} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
