import { AsyncClickHandler, ButtonWithDialog, Input } from '@hrbolek/uoisfrontend-shared';
import { PartInsertAsyncAction } from './Queries/PartInsertAsyncAction';
import { PartDeleteAsyncAction } from './Queries/PartDeleteAsyncAction';

/**
 * InsertPartButton Component
 *
 * A reusable button component for inserting a new "part" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the InsertPartButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the part insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newPart) => null] - Callback executed after the part is successfully inserted.
 *                                                      Receives the new part as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handlePartInserted = (newPart) => {
 *         console.log("Part inserted:", newPart);
 *     };
 *
 *     return (
 *         <InsertPartButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handlePartInserted}
 *         >
 *             Add New Part
 *         </InsertPartButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for inserting a new part.
 */
export const DeletePartButton = ({ children, part, onDone = (part) => null, ...props }) => {
    return (
        <AsyncClickHandler
            asyncAction={PartDeleteAsyncAction}
            defaultParams={part}
            loadingMsg={"Odstraňuji část"}
            onClick={() => onDone(part)}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Chcete odebrat část?" {...props} params={part}>
                <h2>{part?.name} ({part?.nameEn})</h2>
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
