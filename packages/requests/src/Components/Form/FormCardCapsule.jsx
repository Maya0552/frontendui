import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { PersonFill } from "react-bootstrap-icons"
import { FormLink } from "./FormLink"

/**
 * A specialized card component that displays an `FormLink` as its title and encapsulates additional content.
 *
 * This component extends the `CardCapsule` component by using a combination of a `PersonFill` icon and 
 * an `FormLink` component in the card's header. The `children` prop is used to render any content 
 * inside the card body. It is designed for use with entities represented by the `form` object.
 *
 * @component
 * @param {Object} props - The props for the FormCardCapsule component.
 * @param {Object} props.form - The object representing the form entity.
 * @param {string|number} props.form.id - The unique identifier for the form entity.
 * @param {string} props.form.name - The display name for the form entity.
 * @param {React.ReactNode} [props.children=null] - The content to render inside the card's body.
 *
 * @returns {JSX.Element} The rendered card component with a dynamic title and body content.
 *
 * @example
 * // Example usage:
 * import { FormCardCapsule } from './FormCardCapsule';
 * import { Button } from 'react-bootstrap';
 *
 * const formEntity = { id: 123, name: "Example Entity" };
 *
 * <FormCardCapsule form={formEntity}>
 *   <Button variant="primary">Click Me</Button>
 * </FormCardCapsule>
 */
export const FormCardCapsule = ({form, children, title=<><PersonFill /> <FormLink form={form} /></>}) => {
    return (
        <CardCapsule title={title}>
            {children}
        </CardCapsule>
    )
}
