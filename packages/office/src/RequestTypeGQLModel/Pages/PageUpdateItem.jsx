import { useSelector } from "react-redux";
import { UpdateBody as UpdateStateMachineBody } from "../../../../_template/src/StateMachineGQLModel/Mutations/Update"
import { InsertAsyncAction as InsertStateMachineAsyncAction, ReadAsyncAction as ReadStateMachineAsyncAction} from "../../../../_template/src/StateMachineGQLModel/Queries"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks"
import { MediumEditableContent } from "../Components"
import { UpdateBody as UpdateRequestTypeBody} from "../Mutations/Update"
import { UpdateAsyncAction as UpdateRequestTypeAsyncAction} from "../Queries"
import { PageItemBase } from "./PageBase"
import { useEffect } from "react"
import { selectItemById } from "../../../../dynamic/src/Store";
import { StateMachineFlowVisualization } from "../../../../_template/src/StateMachineGQLModel/Components";
import { UpdateForm } from "../../DigitalFormGQLModel/Pages/PageUpdateItem";
import { ReadAsyncAction as ReadDigitalFormAsyncAction} from "../../DigitalFormGQLModel/Queries";
import { ReadFullAsyncAction } from "../Queries/ReadFullAsyncAction";



export const UpdateRequestType = ({ item }) => {
    // const statemachine = item?.statemachine
    // const ctxsm = useAsyncThunkAction(InsertStateMachineAsyncAction, {}, {deferred: true})
    // const ctxrt = useAsyncThunkAction(UpdateRequestTypeAsyncAction, item, {deferred: true})
    const ctx_read_sm = useAsyncThunkAction(ReadStateMachineAsyncAction, {}, {deferred: true})
    const ctx_read_form = useAsyncThunkAction(ReadDigitalFormAsyncAction, {}, {deferred: true})
    // useEffect(() => {
    //     const statemachine = item?.statemachine
    //     if (statemachine) return
    //     const smid = crypto.randomUUID()
    //     const idz = crypto.randomUUID()
    //     const ida = crypto.randomUUID()
    //     const ids = crypto.randomUUID()
    //     const initialStateMachine = {
    //         id: smid,
    //         name: "Stavový automat pro " + item?.name,
    //         states: [
    //             {
    //                 id: idz,
    //                 name: "Žadatel",
    //                 order: 0,
    //             },
    //             {
    //                 id: ids,
    //                 name: "Schvalovatel",
    //                 order: 0,
    //             },
    //             {
    //                 id: ida,
    //                 name: "Archiv",
    //                 order: 999
    //             }
    //         ],
    //         transitions: [
    //             {
    //                 name: "Odeslat",
    //                 sourceId: idz,
    //                 targetId: ids,
    //             },
    //             {
    //                 name: "Vrátit",
    //                 targetId: idz,
    //                 sourceId: ids
    //             },
    //             {
    //                 name: "Archivovat",
    //                 sourceId: ids,
    //                 targetId: ida
    //             }
    //         ]
    //     }
    //     ctxsm.run(initialStateMachine)
    //     ctxrt.run({ id: item.id, statemachineId: smid })

    // }, [item])
    
    // useEffect(() => {
    //     const exec = async () => {
    //         const sm_id = item?.statemachineId
    //         const fm_id = item?.initialFormId
    //         if (sm_id) {
    //             const [sm_response, fm_response] = await Promise.all([
    //                 ctx_read_sm.run({ id: sm_id }),
    //                 ctx_read_form.run({ id: fm_id }),
    //             ]);
    //             console.log("UpdateRequestType", sm_response)
    //             console.log("UpdateRequestType", fm_response)
    //         }  
    //     }
    //     exec()
    // }, [item])

    // const sm_entity = useSelector((rootState) => {
    //     const result = item?.statemachineId != null ? selectItemById(rootState, item?.statemachineId) : null
    //     // console.log(id, rootState, result)
    //     // console.log("useSelectorHook found", id, result)
    //     return result
    // });

    // const fm_entity = useSelector((rootState) => {
    //     const result = item?.initialFormId != null ? selectItemById(rootState, item?.initialFormId) : null
    //     // console.log(id, rootState, result)
    //     // console.log("useSelectorHook found", id, result)
    //     return result
    // });

    return (<>
        {/* <MediumEditableContent item={item} />         */}
        {/* <UpdateStateMachineBody item={entity || {}} /> */}
        {/* {JSON.stringify(ReadFullAsyncAction.__metadata)} */}
        <StateMachineFlowVisualization item={item?.statemachine || {}} />
        <UpdateForm item={item?.initialForm || {}}/>
        
        {/* {JSON.stringify(ctx_read_sm?.entity)}
        {JSON.stringify(entity)} */}
    </>)
}

export const UpdateBody2 = ({ ...props }) => (
    <UpdateRequestTypeBody {...props} DefaultContent={UpdateRequestType}/>
)

export const PageUpdateItem = ({ 
    SubPage=UpdateBody2,
    queryAsyncAction=ReadFullAsyncAction,
    ...props
}) => {
    return (
        <PageItemBase 
            SubPage={SubPage}
            queryAsyncAction={queryAsyncAction}
            {...props}
        />
    )
}