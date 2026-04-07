import { useState, useMemo, useCallback } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ItemInsertAsyncAction } from "../Item/Queries/ItemInsertAsyncAction"
import { DragDropContext } from '@hello-pangea/dnd'
import { HashContainer, LeftColumn, MiddleColumn, SimpleCardCapsule } from '@hrbolek/uoisfrontend-shared'
import { DragableEnvelop, DroppableContainer } from '../DragAndDrop/dad'
import { PencilFill, PlusLg, TrashFill } from 'react-bootstrap-icons'
import { UpdateSectionButton } from '../Section/UpdateSectionButton'
import { DeleteSectionButton } from '../Section/DeleteSectionButton'
import { UpdatePartButton } from '../Part/UpdatePartButton'
import { DeletePartButton } from '../Part/DeletePartButton'
import { Item } from '../Item/Item'
import { UpdateItemButton } from '../Item/UpdateItemButton'
import { DeleteItemButton } from '../Item/DeleteItemButton'
import { HorizontalLine } from '../Part'
import { InsertPartButton } from '../Part/InsertPartButton'
import { InsertSectionButton } from '../Section/InsertSectionButton'
import { useAsyncAction } from '@hrbolek/uoisfrontend-gql-shared'
import { ItemIndex } from '../Item/Visualisers'
import { GroupCardCapsule, InsertGroupButton, InsertStateMachineButton, StateMachineSwitch, StateTransitionsDesigner, VerticalArcGraph } from '@hrbolek/uoisfrontend-ug'
import { RequestTypeReadAsyncAction, RequestTypeUpdateAsyncAction } from '../RequestType/Queries'
import { FormCreateButtonDialog } from './FormCreateButtonDialog'
import { RoleTypeListDesigner } from '@hrbolek/uoisfrontend-ug'

const grid = 8
const getListStyleDefault = (provided, snapshot) => {
    const result = {
        // display: "flex",
        // flexDirection: snapshot.isDraggingOver ?"column":"row", // Stack items horizontaly
        // flexDirection: "row", // Stack items horizontaly
        gap: `${grid}px`, // Add consistent spacing
        background: "transparent",
        // padding: `${grid}px`,
        borderRadius: "4px",
        // minHeight: "100px", // Ensure droppable area has a minimum height
        transition: "background-color 0.3s ease",
    }
    
    if (snapshot.isDraggingOver) {
        const modification = {
            background: "lightblue",
        }
        return {...result, ...modification}
    }
    return result
}

const SectionDesigner = ({section, i, onUpdate, sectionDisabled, partDisabled}) => {
    return (<div type="DragableEnvelop" draggableId={section.id} index={i}>
        <SimpleCardCapsule title={<>
            {section.name}{'\u00A0'}{'\u00A0'}
            <UpdateSectionButton section={{ ...section, parts: null }} className="btn btn-sm btn-outline-secondary" onDone={onUpdate}>
                <PencilFill />
            </UpdateSectionButton>
            <DeleteSectionButton section={section} className="btn btn-sm btn-outline-secondary" onDone={onUpdate}>
                <TrashFill />
            </DeleteSectionButton>
        </>}
        >
            <div type="DroppableContainer" key={section.id} droppableId={section.id} isDropDisabled={sectionDisabled} getListStyle={getListStyleDefault}>

                {section?.parts.map((part, j) => (
                    <div type="DragableEnvelop" draggableId={part.id} index={j}>
                        <SimpleCardCapsule
                            title={<>
                                {part.name}{'\u00A0'}{'\u00A0'}
                                <UpdatePartButton part={{ ...part, items: null }} className="btn btn-sm btn-outline-secondary" onDone={onUpdate}>
                                    <PencilFill />
                                </UpdatePartButton>
                                <DeletePartButton part={part} className="btn btn-sm btn-outline-secondary" onDone={onUpdate}>
                                    <TrashFill />
                                </DeletePartButton>
                            </>}
                        >
                            <DroppableContainer key={part.id} droppableId={part.id} isDropDisabled={partDisabled} getListStyle={getListStyleDefault}>
                                {part?.items.map((item, k) => (
                                    <DragableEnvelop
                                        key={item.id}
                                        draggableId={item.id}
                                        index={k}
                                    >
                                        <Item item={item} title={<>{item.name}{'\u00A0'}{'\u00A0'}
                                            <UpdateItemButton item={item} className="btn btn-sm btn-outline-secondary" onDone={onUpdate}>
                                                <PencilFill />
                                            </UpdateItemButton>
                                            <DeleteItemButton item={item} className="btn btn-sm btn-outline-secondary" onDone={onUpdate}>
                                                <TrashFill />
                                            </DeleteItemButton>
                                            
                                        </>}>

                                        </Item>
                                    </DragableEnvelop>
                                ))}

                            </DroppableContainer>
                        </SimpleCardCapsule>
                    </div>
                ))}
                <HorizontalLine>
                    <InsertPartButton
                        className="btn btn-sm btn-outline-secondary"
                        params={{
                            section_id: section.id,
                            name: 'Nová část',
                            name_en: 'New part',
                            order: (section?.parts || []).length + 1
                        }}
                        onDone={onUpdate}
                    >
                        <PlusLg /> Vložit část
                    </InsertPartButton>
                </HorizontalLine>

            </div>
        </SimpleCardCapsule>

    </div>)
}

export const FormDesigner = ({formDisabled, section, onUpdate, sectionDisabled, partDisabled, formCopy, children}) => {
    const [_section, setSection] = useState(section || formCopy?.sections[0])
    const handleChangeSection = (section) => {
        console.log("section change")
        setSection(prev=> section)
    }
    return (<>
        <div type="DroppableContainer" droppableId={formCopy.id} isDropDisabled={formDisabled} getListStyle={getListStyleDefault}>
            {formCopy?.sections.map((section, i) => (
                <span className='btn btn-light'>
                    <span 
                        className={(section === _section)?'btn btn-sm btn-primary':'btn btn-sm btn-outline-primary'}
                        onClick={() => handleChangeSection(section)}
                    >
                        {section?.name}&nbsp;
                    </span>
                    <UpdateSectionButton 
                        className="btn btn-sm btn-outline-success"
                        section={section}
                        onDone={onUpdate}
                    >
                        <PencilFill />
                    </UpdateSectionButton>
                    <DeleteSectionButton 
                        className="btn btn-sm btn-outline-danger"
                        section={section}
                        onDone={onUpdate}
                    >
                        <TrashFill />
                    </DeleteSectionButton>
                </span>
                
            ))}
            <span className='btn btn-outline-secondary'>
                <InsertSectionButton
                    className='btn btn-sm btn-light'
                    params={{form_id: formCopy.id}}
                    onDone={onUpdate}
                >
                    <PlusLg /> Nová sekce
                </InsertSectionButton>
            </span>
            {/* {children} */}

            <FormDesignerBody
                formDisabled={formDisabled} 
                section={_section} 
                onUpdate={onUpdate} 
                sectionDisabled={sectionDisabled} partDisabled={partDisabled} 
                formCopy={formCopy} 
            />
        </div>
    </>)
}

export const FormDesignerBody = ({formDisabled, section, onUpdate, sectionDisabled, partDisabled, formCopy, children}) => {
    return (<>
        {/* <SimpleCardCapsule title={formCopy.name}> */}
            <div type="DroppableContainer" droppableId={formCopy.id} isDropDisabled={formDisabled} getListStyle={getListStyleDefault}>
                {section && <SectionDesigner section={section} i={0} onUpdate={onUpdate} sectionDisabled={sectionDisabled} partDisabled={partDisabled} />}
                {!section && formCopy?.sections.map((section, i) => (
                    <SectionDesigner section={section} i={i} onUpdate={onUpdate} sectionDisabled={sectionDisabled} partDisabled={partDisabled} />
                ))}
                {children}
            </div>
        {/* </SimpleCardCapsule> */}
    </>)
}

export const ItemsLibrary = ({}) => {
    return (<SimpleCardCapsule title="Knihovna položek">
        <DroppableContainer droppableId="library" isDropDisabled={true} getListStyle={getListStyleDefault}>

            {Object.entries(ItemIndex).map(
                ([id, Visualiser], i) => <DragableEnvelop draggableId={id} index={i} key={id}>
                    <SimpleCardCapsule key={id}>
                        <Visualiser key={id} item={{}} />
                    </SimpleCardCapsule>
                </DragableEnvelop>
            )}

        </DroppableContainer>
    </SimpleCardCapsule>)
}

export const FormDesignerBodyBody = ({form, formDisabled, section, onUpdate, sectionDisabled, partDisabled, formCopy, children}) => {
    return <div type="DroppableContainer" droppableId={form.id} isDropDisabled={formDisabled} getListStyle={getListStyleDefault}>
        {section && <SectionDesigner section={section} i={0} onUpdate={onUpdate} sectionDisabled={sectionDisabled} partDisabled={partDisabled} />}
        {!section && formCopy?.sections.map((section, i) => (
            <SectionDesigner section={section} i={i} onUpdate={onUpdate} sectionDisabled={sectionDisabled} partDisabled={partDisabled} />
        ))}
        {children}
    </div>
}

