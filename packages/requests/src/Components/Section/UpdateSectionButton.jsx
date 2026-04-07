import { AsyncClickHandler, ButtonWithDialog } from '@hrbolek/uoisfrontend-shared';
import { SectionUpdateAsyncAction } from './Queries/SectionUpdateAsyncAction';
import { SectionMediumEditableContent } from './SectionMediumEditableContent';

/**
 * UpdateSectionButton Component
 *
 * A reusable button component for updateing a new "section" into the system. It uses a dialog
 * for collecting necessary inputs and executes an asynchronous action upon confirmation.
 * 
 * This component integrates with `AsyncClickHandler` to manage asynchronous actions, 
 * and `ButtonWithDialog` for rendering a dialog interface. It also utilizes the `Input` 
 * component for rendering form fields dynamically based on the `params` prop.
 *
 * @component
 * @param {Object} props - The props for the UpdateSectionButton component.
 * @param {React.ReactNode} props.children - The content or label for the button.
 * @param {Object} [props.params={}] - The initial parameters for the section updateion action. 
 *                                      Contains default values for the dialog inputs.
 * @param {string} [props.params.name] - The default value for the "Název" field.
 * @param {string} [props.params.name_en] - The default value for the "Anglický název" field.
 * @param {Function} [props.onDone=(newSection) => null] - Callback executed after the section is successfully updateed.
 *                                                      Receives the new section as an argument.
 * @param {...Object} props - Additional props passed to the `ButtonWithDialog` component.
 *
 * @example
 * // Basic Usage
 * const Example = () => {
 *     const handleSectionUpdateed = (newSection) => {
 *         console.log("Section updateed:", newSection);
 *     };
 *
 *     return (
 *         <UpdateSectionButton
 *             params={{ name: "Default Name", name_en: "Default English Name" }}
 *             onDone={handleSectionUpdateed}
 *         >
 *             Add New Section
 *         </UpdateSectionButton>
 *     );
 * };
 *
 * @returns {JSX.Element} A button that opens a dialog for updateing a new section.
 */
export const UpdateSectionButton = ({ children, section, onDone = (section) => null, ...props }) => {
    // console.log(`UpdateSectionButton.section`, section)
    const handleClick = (section) => {
        // console.log(`UpdateSectionButton.section`, section)
        onDone(section)
    }
    return (
        <AsyncClickHandler
            asyncAction={SectionUpdateAsyncAction}
            defaultParams={section}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={handleClick}
        >
            <ButtonWithDialog buttonLabel={children} dialogTitle="Upravit část" {...props} params={section}>
                <SectionMediumEditableContent section={section} />
            </ButtonWithDialog>
        </AsyncClickHandler>
    );
};
