import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { PartUpdateAsyncAction } from './Queries/PartUpdateAsyncAction';
import { PartMediumEditableContent } from './PartMediumEditableContent';

/**
 * UpdatePartButton Component
 *
 * A reusable button component for updateing a new "part" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the UpdatePartButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the part updateion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newPart) => null] - Callback executed after the part is successfully updateed.
 *                                                      Receives the new part as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handlePartUpdateed = (newPart) => {
 *         console.log("Part updateed:", newPart);
 *     };
 *
 *     return (
 *         <UpdatePartButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handlePartUpdateed}
 *         >
 *             Add New Part
 *         </UpdatePartButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for updateing a new part.
 */
export const UpdatePartButton = ({ children, part, onDone = (part) => null, ...props }) => {
    // console.log(`UpdatePartButton.part`, part)
    const handleClick = (part) => {
        // console.log(`UpdatePartButton.part`, part)
        onDone(part)
    }
    return (
        <AsyncClickHandler
            asyncAction={PartUpdateAsyncAction}
            defaultParams={part}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Upravit část" {...props} params={part}>
                <PartMediumEditableContent part={part} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
