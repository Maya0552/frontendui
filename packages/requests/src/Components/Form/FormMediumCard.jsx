import { PersonFill } from "react-bootstrap-icons"
import { FormLink } from "./FormLink"
import { FormCardCapsule } from "./FormCardCapsule"
import { FormMediumContent } from "./FormMediumContent"

/**
 * A card component that displays detailed content for an form entity.
 *
 * This component combines `FormCardCapsule` and `FormMediumContent` to create a card layout
 * with a title and medium-level content. The title includes a `PersonFill` icon and a link to
 * the form entity's details, while the body displays serialized details of the entity along
 * with any additional children passed to the component.
 *
 * @component
 * @param {Object} props - The properties for the FormMediumCard component.
 * @param {Object} props.form - The object representing the form entity.
 * @param {string|number} props.form.id - The unique identifier for the form entity.
 * @param {string} props.form.name - The name or label of the form entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render inside the card body.
 *
 * @returns {JSX.Element} A JSX element combining a card with a title and detailed content.
 *
 * @example
 * // Example usage:
 * const formEntity = { id: 123, name: "Sample Entity" };
 * 
 * <FormMediumCard form={formEntity}>
 *   <p>Additional details or actions for the entity.</p>
 * </FormMediumCard>
 */
export const FormMediumCard = ({form, children}) => {
    return (
        <FormCardCapsule title={<><PersonFill /> <FormLink form={form} /></>}>
            <FormMediumContent form={form}>
                {children}
            </FormMediumContent>
        </FormCardCapsule>
    )
}
