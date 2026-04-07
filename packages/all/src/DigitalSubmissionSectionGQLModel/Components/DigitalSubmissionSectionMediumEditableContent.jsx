import { Input } from "@hrbolek/uoisfrontend-shared"
import { DigitalSubmissionSectionCardCapsule } from "./DigitalSubmissionSectionCardCapsule"
import { DigitalSubmissionFieldMediumEditableContent } from "../../DigitalSubmissionFieldGQLModel/Components/DigitalSubmissionFieldMediumEditableContent"
import { DigitalFormSectionCardCapsule } from "../../DigitalFormSectionGQLModel/Components/DigitalFormSectionCardCapsule"
import { DigitalSubmissionSections } from "../../DigitalSubmissionGQLModel/Components/DigitalSubmissionMediumEditableContent"

/**
 * A component that displays medium-level content for an digitalsubmissionsection entity.
 *
 * This component renders a label "DigitalSubmissionSectionMediumContent" followed by a serialized representation of the `digitalsubmissionsection` object
 * and any additional child content. It is designed to handle and display information about an digitalsubmissionsection entity object.
 *
 * @component
 * @param {Object} props - The properties for the DigitalSubmissionSectionMediumContent component.
 * @param {Object} props.digitalsubmissionsection - The object representing the digitalsubmissionsection entity.
 * @param {string|number} props.digitalsubmissionsection.id - The unique identifier for the digitalsubmissionsection entity.
 * @param {string} props.digitalsubmissionsection.name - The name or label of the digitalsubmissionsection entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render after the serialized `digitalsubmissionsection` object.
 *
 * @returns {JSX.Element} A JSX element displaying the entity's details and optional content.
 *
 * @example
 * // Example usage:
 * const digitalsubmissionsectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalSubmissionSectionMediumContent digitalsubmissionsection={digitalsubmissionsectionEntity}>
 *   <p>Additional information about the entity.</p>
 * </DigitalSubmissionSectionMediumContent>
 */
export const DigitalSubmissionSectionMediumEditableContent = ({
    digitalsubmissionsection, onChange=(e)=>null, onBlur=(e)=>null, children
}) => {
    const sections = digitalsubmissionsection?.sections || []
    const fields = digitalsubmissionsection?.fields?.toSorted(
        (a, b) => (a.order || 0) - (b.order || 0)
    ) || []

    return (<>
            {/* <pre>{JSON.stringify(digitalsubmissionsection, null, 2)}</pre> */}
            {fields.map(field => (
                <DigitalSubmissionFieldMediumEditableContent 
                    key={field.id}
                    digitalsubmissionfield={field}
                    onChange={onChange}
                    onBlur={onBlur}
                />
            ))}
            <DigitalSubmissionSections 
                sections={sections} 
                onChange={onChange}
                onBlur={onBlur}
            /> 
        </>
        // <>           
        //     <Input id={"name"} label={"Název"} className="form-control" defaultValue={digitalsubmissionsection?.name|| "Název"} onChange={onChange} onBlur={onBlur} />
        //     <Input id={"name_en"} label={"Anglický název"} className="form-control" defaultValue={digitalsubmissionsection?.name_en|| "Anglický název"} onChange={onChange} onBlur={onBlur} />
        //     {children}
        // </>
    )
}


// export const groupSectionsByFormSection = (sections) => {
//     const grouped = {}
//     sections.forEach(section => {
//         const formSectionId = section?.formSection?.id || "no-section"
//         if(!grouped[formSectionId]) {
//             grouped[formSectionId] = {
//                 formSection: section?.formSection || {id: null, name: "no-section"},
//                 sections: []
//             }
//         }
//         grouped[formSectionId].sections.push(section)
//     })
//     Object.values(grouped).forEach(group => {
//         group.sections.sort((a, b) => (a.index || 0) - (b.index || 0))
//     })
//     return Object.values(grouped)
// }

