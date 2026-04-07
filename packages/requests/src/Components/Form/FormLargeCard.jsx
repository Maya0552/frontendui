import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn } from "@hrbolek/uoisfrontend-shared"
import { FormCardCapsule } from "./FormCardCapsule"
import { FormMediumCard } from "./FormMediumCard"

/**
 * A large card component for displaying detailed content and layout for an form entity.
 *
 * This component wraps an `FormCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `FormMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the FormLargeCard component.
 * @param {Object} props.form - The object representing the form entity.
 * @param {string|number} props.form.id - The unique identifier for the form entity.
 * @param {string} props.form.name - The name or label of the form entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const formEntity = { id: 123, name: "Sample Entity" };
 * 
 * <FormLargeCard form={formEntity}>
 *   <p>Additional content for the middle column.</p>
 * </FormLargeCard>
 */
export const FormLargeCard = ({form, children}) => {
    return (
        <FormCardCapsule form={form} >
            <Row>
                <LeftColumn>
                    <FormMediumCard form={form}/>
                </LeftColumn>
                <MiddleColumn>
                    {children}
                </MiddleColumn>
            </Row>
        </FormCardCapsule>
    )
}
