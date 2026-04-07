import { useEffect, useMemo, useState } from 'react'
import { AsyncClickHandler, SimpleCardCapsule, TextArea } from "@hrbolek/uoisfrontend-shared"
import { FormMediumEditableContent } from "./FormMediumEditableContent"
import { FormInsertAsyncAction } from './Queries/FormInsertAsyncAction'

/**
 * FormCreationWizard Component
 *
 * A React component that provides an interactive interface for creating a new form.
 * It allows users to define sections and parts of a form using a text-based format
 * and includes dynamic handling for form structure updates and asynchronous form submission.
 *
 * @component
 * @param {Object} props - The properties for the FormCreationWizard component.
 * @param {Object} [props.form] - The initial form object. Defaults to a new form with default names.
 * @param {string} [props.form.name="Nový formulář"] - The name of the form in the default language.
 * @param {string} [props.form.name_en="New form"] - The name of the form in English.
 * @param {Function} [props.onCreate] - Callback function invoked when the form creation is submitted.
 *                                      Receives the newly created form as its argument.
 *
 * @returns {JSX.Element} A component for defining and submitting form structures interactively.
 *
 * @example
 * // Example usage:
 * const handleFormCreation = (newForm) => {
 *     console.log("Form created:", newForm);
 * };
 *
 * <FormCreationWizard
 *     form={{ name: "Survey Form", name_en: "Survey Form" }}
 *     onCreate={handleFormCreation}
 * />
 *
 * @description
 * ### Features:
 * - **Dynamic Text-to-Form Conversion**: Users can define form sections and parts using a simple text format.
 *   - Lines starting with `-` are treated as parts of the most recently defined section.
 *   - Lines without `-` are treated as new sections.
 * - **Asynchronous Form Submission**: Handles form submission through `AsyncClickHandler`, displaying loading states and error handling.
 * - **Editable Form Content**: Includes `FormMediumEditableContent` for directly editing form fields.
 *
 * ### How It Works:
 * 1. **Default Text Definition**:
 *    - The component initializes with a default form structure defined in the `defaultValue` variable.
 *    - Example:
 *      ```
 *      Hlavička
 *      - Žadatel
 *      - Obsah
 *      Posouzení
 *      - Vyjádření
 *      Rozhodnutí
 *      - Vyjádření
 *      ```
 * 2. **Real-Time Updates**:
 *    - Users can modify the form structure via a `<TextArea>`.
 *    - Changes are parsed and converted into a hierarchical `sections` structure using `textToForm`.
 * 3. **Form Submission**:
 *    - Submitting the form triggers the `onCreate` callback with the current form structure.
 */
export const FormCreationWizard = ({form={name: "Nový formulář", name_en: "New form"}, onCreate=(newForm)=>null}) => {
    const defaultValue = 
`Hlavička
- Žadatel
- Obsah
Posouzení
- Vyjádření
Rozhodnutí
- Vyjádření
`
    useEffect(() =>{
        textToForm(defaultValue)
    }, [])

    const textToForm = (value) => {
        const form_id = crypto.randomUUID()

        const lines = value.split('\n').map(line => line.trim())
        console.log("lines", lines)
        const sections = [...(form?.sections || [])]
        let currentSection = null
        lines.forEach(line => {
            if (line.length === 0) return
            if (line.startsWith("-")) {
                if (!currentSection) return
                const partName = line.substring(1).trim()
                const partId = crypto.randomUUID()
                const newPart = {
                    id: partId,
                    sectionId: currentSection.id,
                    name: partName,
                    items: [
                        {
                            id: crypto.randomUUID(),
                            partId: partId,
                            order: currentSection.parts.length + 1,
                            name: "Položka",
                            typeId: "9bdb9476-afb6-11ed-9bd8-0242ac110002"
                        }
                    ]
                }
                currentSection.parts.push(newPart)
            } else {
                currentSection = {
                    id: crypto.randomUUID(),
                    formId: form_id,
                    order: sections.length + 1,
                    name: line,
                    parts: []
                }
                sections.push(currentSection)
            }
        })
        console.log("sections", sections)
        setInputValues({ id: form_id, ...form, sections })
    }

    const handleTextDefinitionChange = (e) => {
        const value = e.target.value
        textToForm(value)       
    }

    const [currentForm, setInputValues] = useState({...form})

    const handleChange = (e) => {
        const value = e.target.value
        const name = e.target.id
        setInputValues(prev => {
            return {...prev, [name]: value}
        })
    }

    const InnerComponent = useMemo(()=>{
        return ({onClick}) => {
            const innerClick = () => {
                onClick(currentForm)
            }
            return <span className="btn btn-outline-primary form-control" onClick={innerClick}>Vytvořit</span>
        }
    })
    return (
    <SimpleCardCapsule title={"Není vytvořen vzorový formulář"}>

        <FormMediumEditableContent form={currentForm} onChange={handleChange} onBlur={handleChange} />
        <p>Vypište do řádků názvy sekcí formuláře. Pokud před řádkem použijete znaménko "-", bude tento řádek považován za název části v dané sekci</p>
        <TextArea label="Sekce (části) formuláře" className="form-control" defaultValue={defaultValue} onChange={handleTextDefinitionChange} />
        <AsyncClickHandler
            asyncAction={FormInsertAsyncAction}
            defaultParams={currentForm}
            loadingMsg={"Ukládám data"}
            // onClick={onDone}
            onClick={onCreate}
        >
            <InnerComponent />            
        </AsyncClickHandler>
    </SimpleCardCapsule>)
}