import Row from "react-bootstrap/Row"
import { LeftColumn, MiddleColumn, SimpleCardCapsuleRightCorner } from "@hrbolek/uoisfrontend-shared"
import { DigitalFormSectionCardCapsule } from "./DigitalFormSectionCardCapsule"
import { DigitalFormSectionMediumCard } from "./DigitalFormSectionMediumCard"
import { DigitalFormSectionMediumContent } from "./DigitalFormSectionMediumContent"
import { DigitalFormFieldMediumContent } from "../../DigitalFormFieldGQLModel/Components/DigitalFormFieldMediumContent"
import { Col } from "react-bootstrap"
import { DigitalFormFieldMediumEditableContent } from "../../DigitalFormFieldGQLModel/Components/DigitalFormFieldMediumEditableContent"
import { DigitalFormFieldCardCapsule } from "../../DigitalFormFieldGQLModel/Components/DigitalFormFieldCardCapsule"
import { DigitalFormFieldButton } from "../../DigitalFormFieldGQLModel/Components/DigitalFormFieldCUDButton"
import { DigitalFormSectionMediumEditableContent } from "./DigitalFormSectionMediumEditableContent"
import { DigitalFormSectionButton } from './DigitalFormSectionCUDButton'
import { ArrowDown, ArrowUp, Pencil, PencilFill, PlusLg, SignIntersection, Trash } from "react-bootstrap-icons"
import { DigitalSubmissionFieldMediumEditableContent } from "../../DigitalSubmissionFieldGQLModel/Components/DigitalSubmissionFieldMediumEditableContent"
import { useEffect, useState } from "react"
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { DigitalFormReadAsyncAction } from "../../DigitalFormGQLModel/Queries"
import { DigitalSubmissionSectionLargeContent } from "../../DigitalSubmissionSectionGQLModel/Components/DigitalSubmissionSectionLargeContent"
import { DigitalSubmissionSectionCardCapsule } from "../../DigitalSubmissionSectionGQLModel/Components/DigitalSubmissionSectionCardCapsule"
import { ExampleDS } from "../../DigitalSubmissionGQLModel/Components/DigitalSubmissionMediumEditableContent"
/**
 * A large card component for displaying detailed content and layout for an digitalformsection entity.
 *
 * This component wraps an `DigitalFormSectionCardCapsule` with a flexible layout that includes multiple
 * columns. It uses a `Row` layout with a `LeftColumn` for displaying an `DigitalFormSectionMediumCard`
 * and a `MiddleColumn` for rendering additional children.
 *
 * @component
 * @param {Object} props - The properties for the DigitalFormSectionLargeCard component.
 * @param {Object} props.digitalformsection - The object representing the digitalformsection entity.
 * @param {string|number} props.digitalformsection.id - The unique identifier for the digitalformsection entity.
 * @param {string} props.digitalformsection.name - The name or label of the digitalformsection entity.
 * @param {React.ReactNode} [props.children=null] - Additional content to render in the middle column.
 *
 * @returns {JSX.Element} A JSX element combining a large card layout with dynamic content.
 *
 * @example
 * // Example usage:
 * const digitalformsectionEntity = { id: 123, name: "Sample Entity" };
 * 
 * <DigitalFormSectionLargeCard digitalformsection={digitalformsectionEntity}>
 *   <p>Additional content for the middle column.</p>
 * </DigitalFormSectionLargeCard>
 */
export const DigitalFormSectionLargeContent = ({digitalformsection, submissionsection, children}) => {
    const {fields=[], sections=[]} = digitalformsection
    
    const childrensubmissionsections = submissionsection?.sections || []
    // console.log("DigitalFormSectionLargeContent.digitalformsection", digitalformsection)
    return (
        <>  
            <DigitalFormSectionFields 
                digitalsectionfields={fields} 
                submissionsection={submissionsection} 
            />
            <DigitalFormSections 
                digitalformsections={sections} 
                submissionsections={childrensubmissionsections}
            />            
            {/* <pre>{JSON.stringify(digitalformsection, null, 2)}</pre> */}
        </>
    )
}

export const DigitalFormSectionDummy = ({ digitalformsection, children }) => {
    const {repeatable, repeatableMax, repeatableMin} = digitalformsection
    const createSubmissionSection = () => {
        return {
            id: crypto.randomUUID(),
            formSection: digitalformsection,
            sections: [],
            fields: [],
        }
    }
    const [submissionSections, setSubmissionSections] = useState(
        Array(repeatableMin).map((_, i) => createSubmissionSection())
    )
    useEffect(() => {
        console.log("DigitalFormSectionDummy.useEffect", digitalformsection)
        setSubmissionSections(
            Array(repeatableMin).map((_, i) => createSubmissionSection())
        )
    }, [digitalformsection, repeatableMin, repeatableMax])
    
    const onAddDummySection = () => {
        console.log("DigitalFormSectionDummy.onAddDummySection", digitalformsection)
        setSubmissionSections(old => [
            ...old,
            createSubmissionSection()
        ])
    }

    if (!repeatable) return (<>NO</>)
    return "DigitalFormSectionDummy"
    return (<>
        {/* REPEATING */}
        {submissionSections.map((sSection, index) => (<>
            {/*  <DigitalSubmissionSectionCardCapsule key={sSection?.id} digitalsubmissionsection={sSection}> */}
                {/* <DigitalSubmissionSectionLargeContent key={sSection?.id} digitalsubmissionsection={sSection} /> */}
                <DigitalSubmissionSectionCardCapsule key={sSection?.id} digitalsubmissionsection={sSection} title={digitalformsection?.name + " " + (index + 1)}>
                    <pre key={sSection?.id}>{JSON.stringify(sSection, null, 4)}</pre>
                </DigitalSubmissionSectionCardCapsule>
                
            {/*  </DigitalSubmissionSectionCardCapsule> */}
        </>)
        )}
        {/* {(repeatableMax - 1) < submissionSections.length && <button className="btn btn-outline-primary form-control" onClick={onAddDummySection}>Zopakovat sekci</button>}
        <button className="btn btn-outline-primary form-control" onClick={onAddDummySection}>Zopakovat sekci</button> */}
    </>)
}

export const DigitalFormSection = ({ digitalformsection, submissionsections }) => {
    const {sections=[], fields=[], repeatable, repeatableMax} = digitalformsection
    const { loading, error, fetch: formrefetch } = useAsyncAction(DigitalFormReadAsyncAction, {id: digitalformsection.formId}, {deferred: true})
    const onDelete = async() => {
        console.log("refetching form from section", digitalformsection)
        const fresh = await formrefetch({id: digitalformsection.formId})
        console.log("refetched form", fresh)
    }
    return (<>
            <DigitalFormSectionCardCapsule 
                digitalformsection={digitalformsection}
                title={digitalformsection?.name}
            >
                <hr />
                <ExampleDS />
                <hr />
                <SimpleCardCapsuleRightCorner>
                    <DigitalFormSectionButton 
                        operation="JSON" 
                        className="btn btn-sm btn-outline-success"
                        digitalformsection={{
                            sectionId: digitalformsection?.id,
                            formId: digitalformsection?.formId,
                            id: crypto.randomUUID(),
                            name: "section",
                            label: "Nová vnořená sekce",
                            labelEn: "New section",
                            description: "Popis / nápověda",
                            order: sections.lenght + 1,
                            repeatable: false,
                            repeatableMin: 1,
                            repeatableMax: 1
                        }}
                    >
                        <SignIntersection /> Přidat vnořenou sekcci JSON
                    </DigitalFormSectionButton>
                    <DigitalFormFieldButton 
                        operation="C" 
                        className="btn btn-sm btn-outline-success"
                        digitalformfield={{
                            formSectionId: digitalformsection?.id,
                            id: crypto.randomUUID(),
                            name: "field",
                            label: "Položka",
                            labelEn: "Item",
                            description: "delší popis",
                            required: false,
                            order: fields.length + 1
                        }}
                    >
                        <PlusLg  /> Přidat položku do sekce
                    </DigitalFormFieldButton>

                    <DigitalFormSectionButton
                        operation="C" 
                        className="btn btn-sm btn-outline-success"
                        digitalformsection={{
                            sectionId: digitalformsection?.id,
                            formId: digitalformsection?.formId,
                            id: crypto.randomUUID(),
                            name: "section",
                            label: "Nová vnořená sekce",
                            labelEn: "New section",
                            description: "Popis / nápověda",
                            order: sections.lenght + 1,
                            repeatable: false,
                            repeatableMin: 1,
                            repeatableMax: 10
                        }}
                    >
                        <PlusLg  /> Přidat vnořenou sekci
                    </DigitalFormSectionButton>                        
                    <DigitalFormSectionButton
                        operation="U" 
                        className="btn btn-sm btn-outline-success"
                        // onDone={onDelete}
                        digitalformsection={digitalformsection}
                    >
                        <PencilFill  />
                    </DigitalFormSectionButton>                

                    <button className="btn btn-sm btn-outline-success">
                        <ArrowUp />
                    </button>
                    <button className="btn btn-sm btn-outline-success">
                        <ArrowDown />
                    </button>
                    <DigitalFormSectionButton
                        operation="D" 
                        className="btn btn-sm btn-outline-danger"
                        onDone={onDelete}
                        digitalformsection={digitalformsection}
                    >
                        <Trash  />
                    </DigitalFormSectionButton>      
                            
                </SimpleCardCapsuleRightCorner>
                {submissionsections.map((submissionsection, index) => {
                    if (index === 0) return (<div key={submissionsection?.id} >
                        <DigitalFormSectionLargeContent 
                                digitalformsection={digitalformsection} 
                                submissionsection={submissionsection}
                            /> 
                    </div>)
                    return (
                        <DigitalSubmissionSectionCardCapsule 
                            key={submissionsection?.id} 
                            digitalsubmissionsection={submissionsection} 
                            title={digitalformsection?.name}
                        >
                            {(index ===0) && (
                            <SimpleCardCapsuleRightCorner>
                                <DigitalFormFieldButton 
                                    operation="C" 
                                    className="btn btn-sm btn-outline-success"
                                    digitalformfield={{
                                        formSectionId: digitalformsection?.id,
                                        id: crypto.randomUUID(),
                                        name: "field",
                                        label: "Položka",
                                        labelEn: "Item",
                                        description: "delší popis",
                                        required: false,
                                        order: fields.length + 1
                                    }}
                                >
                                    <PlusLg  /> Přidat položku do sekce
                                </DigitalFormFieldButton>

                                <DigitalFormSectionButton
                                    operation="C" 
                                    className="btn btn-sm btn-outline-success"
                                    digitalformsection={{
                                        sectionId: digitalformsection?.id,
                                        id: crypto.randomUUID(),
                                        name: "section",
                                        label: "Nová vnořená sekce",
                                        labelEn: "New section",
                                        description: "Popis / nápověda",
                                        order: sections.lenght + 1,
                                        repeatable: false,
                                        repeatableMin: 1,
                                        repeatableMax: 1
                                    }}
                                >
                                    <PlusLg  /> Přidat vnořenou sekci
                                </DigitalFormSectionButton>                        
                                <DigitalFormSectionButton
                                    operation="U" 
                                    className="btn btn-sm btn-outline-success"
                                    // onDone={onDelete}
                                    digitalformsection={digitalformsection}
                                >
                                    <PencilFill  />
                                </DigitalFormSectionButton>                

                                <button className="btn btn-sm btn-outline-success">
                                    <ArrowUp />
                                </button>
                                <button className="btn btn-sm btn-outline-success">
                                    <ArrowDown />
                                </button>
                                <DigitalFormSectionButton
                                    operation="D" 
                                    className="btn btn-sm btn-outline-danger"
                                    onDone={onDelete}
                                    digitalformsection={digitalformsection}
                                >
                                    <Trash  />
                                </DigitalFormSectionButton>                
                            </SimpleCardCapsuleRightCorner>
                            )}
                            {/* {(index === 0) && <DigitalSubmissionSectionLargeContent digitalsubmissionsection={submissionsection} /> } */}
                            {(index === 0) && (
                                <DigitalFormSectionLargeContent 
                                    digitalformsection={digitalformsection} 
                                    submissionsection={submissionsection}
                                /> 
                            )}
                        </DigitalSubmissionSectionCardCapsule>
                    )
                })}
                {submissionsections.length === 0 && (<>
                    <pre>{JSON.stringify(digitalformsection, null, 4)}</pre>
                </>)}
                {/* <pre>DigitalFormSection {JSON.stringify(submissionsections, null, 4)}</pre> */}
                {repeatable && repeatableMax > submissionsections.length && (
                    <button className="btn btn-outline-primary form-control" onClick={null}>Zopakovat sekci</button>
                )}
            
            </DigitalFormSectionCardCapsule>
        </>
    )
}


export const DigitalFormSections = ({ digitalformsections, submissionsections=[] }) => {
    const ordered = digitalformsections.toSorted((a,b) => {
        const aorder = a?.order ?? 0;
        const border = b?.order ?? 0;
        return border - aorder
    })
    // const {repeatable, repeatableMax, repeatableMin} = digitalformsection
    
    return (
        <>
        {/* DigitalFormSections */}
        {/* <pre>DigitalFormSections{JSON.stringify(ordered.map(o => o.id), null, 4)}</pre> */}
        {ordered.map(section => <DigitalFormSection 
            key={section?.id} 
            digitalformsection={section} 
            submissionsections={submissionsections.filter(s => s.formSection?.id === section.id)} 
        />)}
        {/* <pre>DigitalFormSections{JSON.stringify(ordered.map(o => o.id), null, 4)}</pre> */}
        {/* <pre>DigitalFormSections{JSON.stringify(submissionsections.map(ss => ss), null, 4)}</pre> */}
        {/* <pre>DigitalFormSections{JSON.stringify(submissionsections, null, 4)}</pre> */}
        </>
    )
}


export const DigitalSubmissionFieldDummy = ({ digitalformfield, children }) => {
    const [submissionField, setSubmissionField] = useState({
        id: crypto.randomUUID(),
        field: digitalformfield,
        value: null,
        key: 0,
    })
    useEffect(
        () => setSubmissionField(old => {   
            const newSubmissionField = {...old, field: digitalformfield, key: old.key + 1}
            console.log("DigitalSubmissionDummy.useEffect", newSubmissionField)
            return newSubmissionField
        }
        ),
        [digitalformfield]
    )
    // console.log("DigitalSubmissionDummy", submissionField)
    const onChangeField = (e) => {
        const value = e?.target?.value
        setSubmissionField(
            old => ({...old, value})    
        )
    }
    return (<>
        <DigitalSubmissionFieldMediumEditableContent digitalsubmissionfield={submissionField} onChange={onChangeField} onBlur={onChangeField}>
            {children}
        </DigitalSubmissionFieldMediumEditableContent>
         
        </>
        // <DigitalFormFieldMediumContent key={field?.id} digitalformfield={field} />
        // <DigitalFormFieldCardCapsule key={digitalformfield?.id} digitalformfield={digitalformfield}>
            // {/* <DigitalFormFieldMediumEditableContent key={digitalformfield?.id} digitalformfield={digitalformfield} /> */}
            
        // </DigitalFormFieldCardCapsule>
    )
}


export const DigitalFormField = ({ digitalformfield, submissionfield }) => {
    const onUpdateDone = async () => {

    }
    const onDeleteDone = async () => {

    }
    const submissionfieldOnChange = (e) => {
        const { name, value } = e.target
        console.log("DigitalFormField.onChange", name, value)
        // setSubmissionData(prev => ({ ...prev, [name]: value }))
        submissionfield.onChange(submissionfield, value)
    }

    return (
        <>
            {/* <pre>{JSON.stringify(digitalformfield, null, 4)}</pre> */}
            {/* <pre>{JSON.stringify(submissionfield, null, 4)}</pre> */}
            {/* onChange: {submissionfield?.onChange ? "true" : "false"} */}
            <DigitalSubmissionFieldMediumEditableContent 
                digitalsubmissionfield={submissionfield} 
                onChange={submissionfieldOnChange} 
                onBlur={submissionfieldOnChange}
            >
                <SimpleCardCapsuleRightCorner>
                    <DigitalFormFieldButton 
                        operation="U"
                        className="btn btn-sm btn-outline-success"
                        digitalformfield={digitalformfield}
                        onDone={onUpdateDone}
                    >
                        <Pencil />
                    </DigitalFormFieldButton>
                </SimpleCardCapsuleRightCorner>
                {/* {children} */}
            </DigitalSubmissionFieldMediumEditableContent>

        </>
        // <DigitalSubmissionFieldDummy>
            
        //     <SimpleCardCapsuleRightCorner>
        //         <DigitalFormFieldButton 
        //             operation="U" 
        //             className="btn btn-sm btn-outline-success"
        //             digitalformfield={digitalformfield}
        //             onDone={onUpdateDone}
        //         >
        //             <Pencil />
        //         </DigitalFormFieldButton>
        //         <DigitalFormFieldButton 
        //             operation="D" 
        //             className="btn btn-sm btn-outline-danger"
        //             digitalformfield={digitalformfield}
        //             onDone={onDeleteDone}
        //         >
        //             <Trash />
        //         </DigitalFormFieldButton>
        //     </SimpleCardCapsuleRightCorner>  
        //     <pre>{JSON.stringify(submissionfield, null, 4)}</pre>
        // </DigitalSubmissionFieldDummy>
    )
}

export const DigitalFormSectionFields = ({ digitalsectionfields, submissionsection={fields: []} }) => {
    const {fields=[]} = submissionsection
    const ordered = digitalsectionfields.toSorted((a,b) => {
        const aorder = a?.order ?? 0;
        const border = b?.order ?? 0;
        return aorder - border
    })
    return (
        <>
            {/* DigitalFormSectionFields */}
            {ordered.map(formfield => (
                <DigitalFormField 
                    key={formfield?.id} 
                    digitalformfield={formfield} 
                    submissionfield={fields.find(field => field?.field?.id === formfield?.id)} 
                />)
            )}
            {/* <pre>{JSON.stringify(ordered, null, 4)}</pre> */}
            {/* FIELDS<pre>{JSON.stringify(submissionsection?.fields, null, 4)}</pre> */}
        </>
    )
}