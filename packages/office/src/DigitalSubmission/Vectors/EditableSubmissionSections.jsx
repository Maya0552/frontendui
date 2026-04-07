import { useMemo } from "react"
import { EditableSubmissionFields } from "./EditableSubmissionFields"

export const RepeatableFormSection = ({ sections, formSection }) => {
    return (
        <div>
            {sections.map( (section) => {
                return (
                    <div key={section?.id}>
                        <h2>{section?.formSection?.name}</h2>
                        
                        <h2>{section?.formSection?.repeatMin}-{section?.formSection?.repeatMax}</h2>
                        <pre>{JSON.stringify(section?.formSection)}</pre>
                        <EditableSubmissionFields item={section} />
                        {section?.name}
                        {JSON.stringify(Object.keys(section))}
                    </div>
                )        
            })}
        </div>
    )
}

export const SingleFormSection = ({ sections, formSection }) => {
    const Error = sections?.length > 1
    return (
        <div>
            {Error && <>Chybna data</>}
            {sections.map( (section) => {
                return (
                    <div key={section?.id}>
                        <h2>{section?.formSection?.name}</h2>
                        
                        <h2>{section?.formSection?.repeatMin}-{section?.formSection?.repeatMax}</h2>
                        <pre>{JSON.stringify(section?.formSection)}</pre>
                        <EditableSubmissionFields item={section} />
                        {section?.name}
                        {JSON.stringify(Object.keys(section))}
                    </div>
                )        
            })}
        </div>
    )
}

export const EditableSubmissionSections = ({ item }) => {
    const { sections=[] } = item || {}
    
    const groupedSections = useMemo(()=>{
        const result = {}
        for(const s of sections) {
            const id = s?.formSection?.id || "__missing__"
            const { sections: sectionList=[] } = result?.[id] || {formSection: s?.formSection || {id}}
            sectionList.push(s)
            result[id] = {
                formSection: s?.formSection,
                sections: sectionList
            }
        }
        return result
    }, [sections])

    return (
        <>
            {Object.entries(groupedSections).map(([key, {formSection, sections: values}], index) => {
                return (
                    <div key={formSection?.id}>
                        '{key}'<br/>
                        '{JSON.stringify(formSection)}'<br/>
                        '{formSection?.label}'<br/>
                        {formSection?.repeatable ? <RepeatableFormSection formSection={formSection} sections={values} />
                            : <SingleFormSection formSection={formSection} sections={values} />
                        }

                    </div>
                )
            })}
        </>
    )
}