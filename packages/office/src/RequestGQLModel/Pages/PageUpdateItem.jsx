import { useEffect } from "react"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks"
import { FillItem, FillItemBody, UpdateForm as UpdateSubmission } from "../../DigitalSubmission/Pages/PageFillItem"
import { ReadAsyncAction } from "../../DigitalSubmission/Queries"
import { UpdateBody } from "../Mutations/Update"
import { PageItemBase } from "./PageBase"
import { StateMachineFlowVisualization } from "../../../../_template/src/StateMachineGQLModel/Components/MediumEditableContent"

import { ReadFullRequestAsyncAction } from "../Queries/ReadFullRequestAsyncAction"
import { Tree } from "../../../../_template/src/Base/Vectors/VectorAttribute"
import { MoveToButton } from "../Mutations/MoveTo"
import { Link } from "../Components"
import { XLg } from "react-bootstrap-icons"
import { ReadShortRequestAsyncAction } from "../Queries/ReadShortRequestAsyncAction"

export const EditRequest = ({ item, showStateMachine=true }) => {
    // const {id, lastchange} = item
    // const { run } = useAsyncThunkAction(ReadFullRequestAsyncAction, {id}, {deferred: true})
    // useEffect(() => {
    //     const runIt = async () => {
    //         const result = await run({id})
    //         console.log("EditRequest.useEffect", lastchange)
    //     }
    //     runIt()
    // }, [id, lastchange])

    const statemachine = item?.state?.statemachine || {}
    return (<>
        <div className="screen-only">
        {showStateMachine && 
            <StateMachineFlowVisualization item={item?.state?.statemachine || {}} showMatrix={false} />
        }
        {/* <StateMachineFlowVisualization item={item?.statemachine || {}} /> */}

        {statemachine?.states?.map(s => {
            return (
                <MoveToButton 
                    className="btn btn-outline-primary mb-2 me-2"
                    item={{
                        id: item?.id,
                        lastchange: item?.lastchange,
                        targetStateId: s?.id,
                        msg: "Posunuto stavem pomocí tlačítka"
                    }} 
                    onOk={(result)=>(null)}
                >
                    Přesunout do stavu {s?.name}
                </MoveToButton>
            )
        })}
        </div>
        <FillItemBody submission={item?.activeSubmission} debug={false}/>
        
        {/* <Tree item={item} />
        <pre>{JSON.stringify(item, null, 2)}</pre> */}
        {/* {JSON.stringify(item)} */}
        
        {/* {ctx.entity && <FillItem item={ctx.entity} />} */}
        
    </>
        
    )
}




export const PageUpdateItem = ({ 
    SubPage=EditRequest,
    // SubPage=() => <></>,
    queryAsyncAction=ReadFullRequestAsyncAction,
    ...props
}) => {
    return (<>
    {/* {queryAsyncAction?.ename} */}
        <PageItemBase 
            SubPage={SubPage}
            // ItemLayout={({children})=>children}
            queryAsyncAction={queryAsyncAction}
            {...props}
        />
        </>
    )
}

const ZenLayout = ({ item, children }) => {
    return (
        <div>
            <div className="">
            <div className="screen-only col-xl-2">
                <Link item={item} action="edit" className="btn btn-outline-primary">
                    {/* Ukončit Zen */}
                    <XLg />
                </Link>
            </div>
            </div>
            <div className="col-xl-8 offset-xl-2">{children}</div>
        {/* <div className="col-md-2 offset-md-2"></div> */}
        </div>
    )
}

const ZenSubPage = ({ item }) => {
    return (<>
        
        <EditRequest 
            item={item}
            submission={item?.activeSubmission} 
            showStateMachine={false}
            debug={false}
        />
    </>
    )
}


export const PageZenUpdateItem = ({ 
    SubPage=ZenSubPage,
    // SubPage=() => <></>,
    queryAsyncAction=ReadFullRequestAsyncAction,
    ...props
}) => {
    return (<>
    {/* {queryAsyncAction?.ename} */}
        
        <PageItemBase 
            SubPage={SubPage}
            ItemLayout={ZenLayout}
            queryAsyncAction={queryAsyncAction}
            {...props}
        />
        </>
    )
}


