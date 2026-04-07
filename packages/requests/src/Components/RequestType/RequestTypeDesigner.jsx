import { useState, useMemo, useCallback, useEffect } from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { ItemInsertAsyncAction } from "../Item/Queries/ItemInsertAsyncAction"
import { DragDropContext } from '@hello-pangea/dnd'
import { HashContainer, LeftColumn, MiddleColumn, SimpleCardCapsule, TextArea } from '@hrbolek/uoisfrontend-shared'
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
import { GroupCardCapsule, InsertGroupButton, InsertStateMachineButton, MembershipCUDButton, StateMachineSwitch, StateTransitionsDesigner, VerticalArcGraph } from '@hrbolek/uoisfrontend-ug'
import { RequestTypeReadAsyncAction, RequestTypeUpdateAsyncAction } from './Queries'
import { FormCreateButtonDialog } from '../Form/FormCreateButtonDialog'
import { RoleTypeListDesigner } from '@hrbolek/uoisfrontend-ug'
import { FormDesignerBody, FormDesigner, ItemsLibrary } from '../Form/FormDesigner'
import { FormCreationWizard } from '../Form/FormCreationWizard'
import { InputUser } from '@hrbolek/uoisfrontend-ug'

const CreateFormCopy = (form) => {
    const formCopy = {
        ...form, 
        sections: (form?.sections || []).toSorted((a, b) => (a?.order || 0) - (b?.order || 0)).map(
            (section, iindex) => ({
                ...section,
                order: iindex,
                parts: (section?.parts || []).toSorted((a, b) => (a?.order || 0) - (b?.order || 0)).map(
                    (part, jindex) => ({
                        ...part,
                        order: jindex,
                        items: (part?.items || []).toSorted((a, b) => (a?.order || 0) - (b?.order || 0)).map(
                            (item, kindex) => ({
                                ...item,
                                order: kindex
                            })
                        )
                    })
                )
            })
        )
    }
    return formCopy
}

const CreateFormIndex = (formCopy) => {
    const result = { [formCopy.id]: formCopy }
    formCopy?.sections.forEach((section) => {
        result[section.id] = { ...section, form: formCopy }
        section?.parts.forEach((part) => {
            result[part.id] = { ...part, section }
            part?.items.forEach((item) => {
                result[item.id] = { ...item, part }
            })
        })
    })
    return result

}


const createDragStartHandler = (index, setDropAllowed) => {
    return (start) => {
        const { source } = start
        const sourceObject = index[source.droppableId]
        if (sourceObject) {
            const map = {
                ItemGQLModel: { formDisabled: true, sectionDisabled: true, partDisabled: false },
                PartGQLModel: { formDisabled: true, sectionDisabled: false, partDisabled: true },
                SectionGQLModel: { formDisabled: false, sectionDisabled: true, partDisabled: true },
            }
            const __typename = sourceObject.__typename
            if (__typename) {
                const allowedSetup = map[sourceObject.__typename]
                setDropAllowed(allowedSetup)
                console.log("onDragStart", start, allowedSetup)
            }
            return
        }

        if (source.droppableId === "library") {
            const allowedSetup = { formDisabled: true, sectionDisabled: true, partDisabled: false }
            setDropAllowed(allowedSetup)
            console.log("onDragStart", start, allowedSetup)
            return
        }
        // Default fallback
        setDropAllowed({ formDisabled: true, sectionDisabled: true, partDisabled: true })
        console.log("WTF onDragStart (default)", start)
    }
}

const createDragEndHandler = (setDropAllowed, createItem, index) => {
    return (result) => {
        console.log("onDragEnd", result)
        setDropAllowed(prev => ({ formDisabled: false, sectionDisabled: false, partDisabled: false }))

        if (!result.destination) return

        const { source, destination, draggableId } = result
        const sourceParentId = source.droppableId
        const destinationParentId = destination.droppableId
        console.log("onDragEnd.sourceParentId", sourceParentId)
        if (sourceParentId === "library") {
            const targetPartId = destination.droppableId
            const itemTypeId = draggableId
            const item = {
                id: crypto.randomUUID(),
                name: "Nova polozka",
                type_id: itemTypeId,
                part_id: targetPartId,
                order: destination.index,
                state_id: crypto.randomUUID()
            }
            createItem(item)

            return
        }

        const map = {
            FormGQLModel: "sections",
            PartGQLModel: "items",
            SectionGQLModel: "parts",
        }

        if (sourceParentId === destinationParentId) {
            // Same parent: reorder
            const parent = index[sourceParentId]
            const itemsName = map[parent.__typename]
            const parentItems = [...parent[itemsName]]
            const [movedItem] = parentItems.splice(source.index, 1)
            parentItems.splice(destination.index, 0, movedItem)
            parent[itemsName] = parentItems
        } else {
            // Move between parents
            const sourceParent = index[sourceParentId]
            const destinationParent = index[destinationParentId]
            const itemsName = map[sourceParent.__typename]
            const [movedItem] = sourceParent[itemsName].splice(source.index, 1)
            destinationParent[itemsName].splice(destination.index, 0, movedItem)
        }
    }
}

export const RequestTypeDesigner = ({ requesttype, section }) => {
    const { statemachine, group, templateFormId, templateForm: form } = requesttype

    const {states=[]} = statemachine || {}
    const [activeIndex, setActiveIndex] = useState(0)
    const [activeState, setActiveState] = useState(states[activeIndex])
    const [{ 
        formDisabled, 
        sectionDisabled, 
        partDisabled,
    }, setDropAllowed] = useState({
        formDisabled: true,
        sectionDisabled: true,
        partDisabled: true
    });

    const formCopy = useMemo(() => CreateFormCopy(form), [form])
    const index = useMemo(() => CreateFormIndex(formCopy), [form]);

    const onDragStart = useCallback(
        createDragStartHandler(index, setDropAllowed),
        [index, setDropAllowed]
    );

    const createItem = async (newItem) => {
        const item_from_server = await item_insert(newItem)
        onUpdate()
    }

    // console.log("allowedSetup", { formDisabled, sectionDisabled, partDisabled });
    const onDragEnd = useCallback(
        createDragEndHandler(setDropAllowed, createItem, index),
        [setDropAllowed, createItem, index]
    );


    const { fetch: updateRequestType, loading, error } = useAsyncAction(RequestTypeUpdateAsyncAction, {...requesttype}, {deferred: true})
    const {
        error: request_type_error, 
        loading: request_type_loading, 
        // entity: request_type, 
        // dispatchResult: request_type_dispatch_result,
        fetch: request_type_refresh
    } = useAsyncAction(RequestTypeReadAsyncAction, {...requesttype}, {deferred: true})

    const {
        error: item_error, 
        loading: item_loading, 
        entity: item, 
        dispatchResult: item_dispatch_result,
        fetch: item_insert
    } = useAsyncAction(ItemInsertAsyncAction, {}, {deferred: true})

    const onUpdate = () => {
        request_type_refresh({...requesttype})
    }

    // const handleFollowTransition = (transition) => {
    //     console.log("handleFollowTransition", transition)
    //     const targetId = transition.target.id
    //     const target = states.find(state => state.id === targetId)
    //     const newIndex = states.indexOf(target)
    //     if ((newIndex === 0) | (newIndex)) {
    //         setActiveIndex(prev => newIndex)
    //         setActiveState(prev => target)
    //     }
    // }

    const handleStateSwitch = (state) => {
        console.log("active state changed")
        const targetId = state.id
        const target = states.find(state => state.id === targetId)
        const newIndex = states.indexOf(target)
        if ((newIndex === 0) | (newIndex)) {
            setActiveIndex(prev => newIndex)
            setActiveState(prev => target)
        }
    }
    
    if (!group) {
        const OnCreateGroupDone = async (group) => {
            console.log("OnCreateGroupDone", group)
            const updatedRequestType = await updateRequestType({...requesttype, group_id: group.id})
            console.log("OnCreateGroupDone.Updated", updatedRequestType)
        }
        return (<>
            <span className='btn btn-light'>
                Nejsou nastavena práva k vytvoření požadavku
            </span>
            <InsertGroupButton onDone={OnCreateGroupDone}
                className="btn btn-outline-secondary"
                params={{
                    name: `Oprávnění pro požadavky (${requesttype.name})`,
                    name_en: `Permissions for requests (${requesttype.nameEn})`
                }}
            >
                Vytvořit skupinu
            </InsertGroupButton>
        </>)
    }
    if (!statemachine) {
        const onCreateStatemachineDone = async (statemachine) => {
            console.log("OnCreateGroupDone", statemachine)
            const sortedstates = statemachine.states.toSorted((a, b)=> ((a?.order||0)-(b?.order||0)))
            const firststate = sortedstates[0]
            const updatedRequestType = await updateRequestType({ ...requesttype, statemachine_id: statemachine.id, state_id: firststate.id})
            console.log("OnCreateGroupDone.Updated", updatedRequestType)
        }
    
        return <StateMachineCreationWizard statemachine={{}} onDone={onCreateStatemachineDone} />
    }
    if (!form) {
        const onCreateForm = async (form) => {
            console.log("onCreateForm", form)
            console.log("onCreateForm", requesttype)
            const updatedRequestType = await updateRequestType({...requesttype, template_form_id: form.id})
            console.log("onCreateForm.Updated", updatedRequestType)
        }
    
        return <FormCreationWizard form={{name: "Nový formulář", name_en: "New form"}} onCreate={onCreateForm}/>
        
    }
    // console.log("statemachine", statemachine)
    return (
        <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
            <Row>
                <LeftColumn>
                    <HashContainer>
                        <ItemsLibrary id="library"/>
                        <GroupCardCapsule id="permissions" group={group}>
                            P
                            <MembershipCUDButton 
                                operation='C'
                                className="btn btn-outline-primary"
                                membership={{
                                    startdate: "2025-01-01T01:01:59", 
                                    enddate: "2025-01-01T01:01:59", 
                                    // group
                                }}
                            >
                                Add Mem
                            </MembershipCUDButton>
                            P
                            <InputUser className="form-control" label="Přidat uživatele"/>
                        </GroupCardCapsule> 
                        <SimpleCardCapsule title={"proces"} id="graph">
                            <VerticalArcGraph statemachine={statemachine} activeNodeId={activeState?.id}/>
                        </SimpleCardCapsule>
                        <SimpleCardCapsule id="roles" title={`Role pro stav "${activeState?.name}"`}>
                            {/* Role
                            readerslistId
  	                        writerslistId<br /> */}
                            {/* {JSON.stringify(activeState)} */}
                            {/* {activeState?.readerslistId}<br />
                            {activeState?.writerslistId} */}
                            {activeState?.readerslistId && 
                            <SimpleCardCapsule title={"Čtení"}>
                                
                                <RoleTypeListDesigner 
                                    roletypelist={{id: activeState?.readerslistId}}
                                >
                                    
                                        {/* {JSON.stringify(activeState)} */}
                                    
                                </RoleTypeListDesigner>
                            </SimpleCardCapsule>
                            }
                            {activeState?.writerslistId && 
                            <SimpleCardCapsule title={"Zápis"}>
                                <RoleTypeListDesigner 
                                    roletypelist={{id: activeState?.writerslistId}}
                                >
                                    
                                        {/* {JSON.stringify(activeState)} */}
                                    
                                </RoleTypeListDesigner>
                            </SimpleCardCapsule>
                            }
                        </SimpleCardCapsule>
                    </HashContainer>
                </LeftColumn>
                
                <MiddleColumn>
                    
                    <FormDesigner formDisabled={formDisabled} 
                        section={section} 
                        onUpdate={onUpdate} 
                        sectionDisabled={sectionDisabled} partDisabled={partDisabled} 
                        formCopy={formCopy} 
                    />
                    {/* <FormDesignerBody
                        formDisabled={formDisabled} 
                        section={section} 
                        onUpdate={onUpdate} 
                        sectionDisabled={sectionDisabled} partDisabled={partDisabled} 
                        formCopy={formCopy} 
                    >
                    
                    </FormDesignerBody> */}
                    <HorizontalLine>Přechody</HorizontalLine>
                    <StateTransitionsDesigner state={activeState} statemachine={statemachine} onStateSwitch={handleStateSwitch} onChange={onUpdate}/>
                    <HorizontalLine>Stavy</HorizontalLine>
                    <StateMachineSwitch state={activeState} statemachine={statemachine} onStateSwitch={handleStateSwitch} onChange={onUpdate}/>
                </MiddleColumn>
            </Row>
        </DragDropContext>
    );
};

export const StateMachineCreationWizard = ({statemachine={}, onDone=(statemachine)=>null}) => {
    const [_stateMachine, setStateMachine] = useState(statemachine)
    
    const changeStateWithText = (trimmedLines) => {
        const newStatemachine = {
            id: crypto.randomUUID(),
            name: "Popis procesu",
            nameEn: "Process description",
            states: [],
            ...statemachine
        }
        const myStates = trimmedLines.map((line, index) => {
            const state = {
                id: crypto.randomUUID(),
                statemachineId: newStatemachine.id,
                name: line,
                order: index,
                targets: []
            }
            return state
        })

        myStates.forEach((state, index) => {
            if (index > 0) {
                // Create a target relationship to the previous state
                state.targets.push({
                    id: crypto.randomUUID(),
                    statemachineId: newStatemachine.id,
                    name: "Vrátit",
                    nameEn: "Return",
                    sourceId: state.id,
                    targetId: myStates[index - 1].id,
                })
            }

            if (index < myStates.length - 1) {
                state.targets.push({
                    id: crypto.randomUUID(),
                    statemachineId: newStatemachine.id,
                    name: "Odeslat",
                    nameEn: "Send",
                    sourceId: state.id,
                    targetId: myStates[index + 1].id,
                })
            }
        })
        newStatemachine.states.push(...myStates)

        setStateMachine(newStatemachine)
    }

    useEffect(() => {
        const value = "Žadatel\nPosouzení\nSchvalovatel"
        const trimmedLines = value
            .split('\n') // Split the string into lines
            .map(line => line.trim()); // Remove whitespace from the start and end of each line
        changeStateWithText(trimmedLines)

    }, [statemachine])

    const handleTextAreaChange = (e) => {
        const value = e.target.value
        if (!value) return
        const trimmedLines = value
            .split('\n') // Split the string into lines
            .map(line => line.trim()); // Remove whitespace from the start and end of each line
        
        // Structure template
        changeStateWithText(trimmedLines)
    }
    
    return (<>
        <SimpleCardCapsule title={
            <span className='btn btn-light'>
                Není popsán proces zpracování požadavku
            </span>
        }>
            <TextArea 
                label={"stavy"} 
                className='form-control' 
                defaultValue={"Žadatel\nPosouzení\nSchvalovatel"} 
                placeHolder={"Napište do samostatných řádků požadované stavy"}
                onChange={handleTextAreaChange}
                onBlur={handleTextAreaChange}
            />
            <InsertStateMachineButton
                className="btn btn-outline-primary form-control"
                onDone={onDone}
                params={_stateMachine}
            >
                Vytvořit popis zpracování požadavku
            </InsertStateMachineButton>
            <br />
            <div>
                {JSON.stringify(_stateMachine)}
            </div>
        </SimpleCardCapsule>
    </>)
}

