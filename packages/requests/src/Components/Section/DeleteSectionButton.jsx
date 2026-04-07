import { AsyncClickHandler, ButtonWithDialog, Input } from '@hrbolek/uoisfrontend-shared';
import { SectionInsertAsyncAction } from './Queries/SectionInsertAsyncAction';
import { SectionDeleteAsyncAction } from './Queries/SectionDeleteAsyncAction';

/**
 * InsertSectionButton Component
 *
 * A reusable button component for inserting a new "section" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the InsertSectionButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the section insertion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newSection) => null] - Callback executed after the section is successfully inserted.
 *                                                      Receives the new section as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleSectionInserted = (newSection) => {
 *         console.log("Section inserted:", newSection);
 *     };
 *
 *     return (
 *         <InsertSectionButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleSectionInserted}
 *         >
 *             Add New Section
 *         </InsertSectionButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for inserting a new section.
 */
export const DeleteSectionButton = ({ children, section, onDone = (section) => null, ...props }) => {
    return (
        <AsyncClickHandler
            asyncAction={SectionDeleteAsyncAction}
            defaultParams={section}
            loadingMsg={"Odstraňuji část"}
            onClick={() => onDone(section)}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Chcete odebrat část?" {...props} params={section}>
                <h2>{section?.name} ({section?.nameEn})</h2>
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
