import { useState } from 'react'
import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { InfiniteScroll, LazyRender } from "@hrbolek/uoisfrontend-shared"
import { SectionMediumContent } from "../../Section/SectionMediumContent"
import { SectionPartsAttribute, SectionPartsAttributeView } from "../../Section/Vectors/SectionPartsAttribute"
import { DragDropContext, DragableEnvelop, DroppableContainer } from '../../DragAndDrop/dad';
import { PlusLg } from 'react-bootstrap-icons'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'
import { HorizontalLine } from '../../Part'

/**
 * A component for displaying the `section` attribute of an form entity.
 *
 * This component checks if the `section` attribute exists on the `form` object. If `section` is undefined,
 * the component returns `null` and renders nothing. Otherwise, it maps over the `section` array and
 * displays a placeholder message and a JSON representation for each item in the `section`.
 *
 * @component
 * @param {Object} props - The props for the FormSectionAttribute component.
 * @param {Object} props.form - The object representing the form entity.
 * @param {Array} [props.form.section] - An array of section items associated with the form entity.
 * Each item is expected to have a unique `id` property.
 *
 * @returns {JSX.Element|null} A JSX element displaying the `section` items or `null` if the attribute is undefined.
 *
 * @example
 * // Example usage:
 * const formEntity = { 
 *   section: [
 *     { id: 1, name: "Section Item 1" }, 
 *     { id: 2, name: "Section Item 2" }
 *   ] 
 * };
 *
 * <FormSectionAttribute form={formEntity} />
 */
export const FormSectionAttributeView = ({form}) => {
    const sections = ([...form?.sections || []]).sort((a,b) => a?.order - b?.order)
    if (typeof sections === 'undefined') return null
    const [index, setIndex] = useState(0)
    const sectionToRender = sections[index]
    return (
        <>  

            <div className='screen-only '>
            <div className='btn-group d-flex flex-wrap' role='group' aria-label="Sekce formuláře">
            {sections.map(
                (section, _index) => 
                    <button key={section.id}
                        type={"button"} 
                        onClick={() => setIndex(_index)}
                        className={"btn " + (index === _index? "btn-primary": "btn-outline-success")} 
                        >
                            {section?.name}
                    </button>
            )}
            </div>
            </div>
            
            {sections.map((section) => <div key={section.id} className={section===sectionToRender?"":"print-only"}>
                <LazyRender>
                    <SectionPartsAttributeView section={section} />
                </LazyRender>
            </div>
            )}

        </>
    )
}


const ButtonLike = ({section, children, ...props}) => {
    return (
        <div
            style={{
                padding: "8px 16px",
                cursor: "pointer",
                userSelect: "none",
                textAlign: "center",
                minWidth: "100px",
            }}
            {...props}
        >
            {children}
        </div>
    )
}

const SectionUpdateMutation = 
`
mutation SectionUpdate($id: UUID!, $lastchange: DateTime!, $name: String, $order: Int) {
  result: formSectionUpdate(section: {id: $id, lastchange: $lastchange, name: $name, order: $order}) {
    id
    msg
    section {
      __typename
      id
      form {
        id
        request { 
          id
        }
      }
    }
  }
}
`

const RequestQueryRead = `
query RequestQueryRead($id: UUID!) {
    result: requestById(id: $id) {
     __typename
    id
    name
    histories {
      __typename
      id
      name
      state { name }
      form {
        ...Form
      }
      request {
        __typename
        id
        name
      }
      createdby { id fullname }
      state {
        id
        name
      }
      lastchange
    }
    form {
      __typename
      ...Form
    }
  }
}

fragment Form on FormGQLModel {
        __typename
      id
      name
      state {
        __typename
        id
        name
        readerslistId
      }
      sections {
        __typename
        id
        lastchange
        name
        order
        parts {
          __typename
          id
          lastchange
          name
          order
          items {
            __typename
            lastchange
            id
            name
            value
            order
            type {
              id
              name
            }
          }
        }
      }
}
`

const RequestReadAsyncAction = createAsyncGraphQLAction(RequestQueryRead)

const SectionUpdateAsyncAction = createAsyncGraphQLAction(
    SectionUpdateMutation,
    (jsonResult) => (dispatch, getState, next) => {
        console.log("SectionUpdateAsyncAction", jsonResult)
        const result = jsonResult?.data?.result
        console.log("SectionUpdateAsyncAction", result)
        if (result) {
            const request = result?.section?.form?.request
            console.log("SectionUpdateAsyncAction", request)
            if (request) return next(request)
        }
    },
    // RequestReadAsyncAction
)

export const FormSectionAttribute = ({ form }) => {
    // Sort and initialize sections
    const sections = [...(form?.sections || [])].sort((a, b) => a?.order - b?.order)
    const {error: errorSection, loading: loadingSection, fetch: updateSection} = useAsyncAction(SectionUpdateAsyncAction, {}, {deferred: true})
    const {error: errorRequest, loading: loadingRequest, fetch: refreshRequest} = useAsyncAction(RequestReadAsyncAction, {}, {deferred: true})
    const [index, setIndex] = useState(0);

    const onDragEnd = (result) => {       
        if (!result.destination) return;

        const reorderedSections = Array.from(sections);
        const [movedSection] = reorderedSections.splice(result.source.index, 1);
        reorderedSections.splice(result.destination.index, 0, movedSection);

        // Optionally update the "order" field if it's needed
        // reorderedSections.forEach((section, idx) => (section.order = idx + 1));
        const reorder = async (reorderedSections) => {
            const futures = reorderedSections.map(
                (section, idx) => {
                    // (section.order = idx + 1)
                    return updateSection({...section, order: idx + 1})
            });
            const updates = await Promise.all(futures)
            console.log("updates", updates)
            return updates
        }
        const reorderAndUpdateRequest = async (reorderedSections) => {
            const results = await reorder(reorderedSections)
            const request = results[0]
            console.log("reorderAndUpdateRequest", results)
            console.log("reorderAndUpdateRequest", request)
            refreshRequest(request)
        }
        // setSections(reorderedSections);
        reorderAndUpdateRequest(reorderedSections)
        // Adjust active index if the dragged item is the currently selected section
        if (index === result.source.index) {
            setIndex(result.destination.index);
        }
    }  

    const sectionToRender = sections[index];

    return (
        <>
            {loadingSection && "Ukládám sekci"}
            {loadingRequest && "Aktualizuji sekci"}
            {errorSection && "Chyba při ukládání sekce"}
            {errorRequest && "Chyba při aktualizaci"}
            <DragDropContext onDragEnd={onDragEnd}>
                <DroppableContainer droppableId="library" >
                    {sections.map((section, _index) => (
                        <DragableEnvelop key={section.id} index={_index} draggableId={section.id} >
                            <ButtonLike 
                                className={`d-flex flex-wrap btn ${_index === index ? "btn-primary" : "btn-outline-secondary"}`}
                                section={section} 
                                onClick={() => setIndex(_index)}>
                                {section.name}
                            </ButtonLike>
                        </DragableEnvelop>
                    ))}
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip id="custom-tooltip" style={{ backgroundColor: "darkblue", color: "white" }}>
                                Přidat sekci
                            </Tooltip>
                        }
                    >
                        <button className="btn btn-light"><PlusLg /></button>
                    </OverlayTrigger>
                </DroppableContainer>
            </DragDropContext>
            {/* Render the currently selected section */}
            <LazyRender>
                <SectionPartsAttribute section={sectionToRender} />
            </LazyRender>
        </>
    );
};


const SectionAttributeQuery = `
query FormQueryRead($id: id, $where: SectionInputFilter, $skip: Int, $limit: Int) {
    result: formById(id: $id) {
        __typename
        id
        section(skip: $skip, limit: $limit, where: $where) {
            __typename
            id
        }
    }
}
`

const SectionAttributeAsyncAction = createAsyncGraphQLAction(
    SectionAttributeQuery,
    processVectorAttributeFromGraphQLResult("section")
)

export const FormSectionAttributeInifite = ({form}) => { 
    const {section} = form

    return (
        <InfiniteScroll 
            Visualiser={'SectionMediumCard'} 
            actionParams={{skip: 0, limit: 10}}
            asyncAction={SectionAttributeAsyncAction}
        />
    )
}