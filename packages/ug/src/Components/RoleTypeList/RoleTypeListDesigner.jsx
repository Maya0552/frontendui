import { useEffect } from 'react'
import { useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { RoleTypeListReadAsyncAction } from "./Queries/RoleTypeListReadAsyncAction"
import { ErrorHandler, LoadingSpinner, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"
import { RoleTypeListTypeCDButton } from "./RoleTypeListTypeCDButton"
import { TrashFill } from "react-bootstrap-icons"


export const RoleTypeListDesigner = ({roletypelist, children}) => {
    const {loading, error, entity, fetch, dispatchResult} = useAsyncAction(RoleTypeListReadAsyncAction, roletypelist, {deferred: true})
    const roletypelistId = roletypelist?.id
    useEffect(() => {
        fetch({id: roletypelistId})
    }, [roletypelistId])

    const handleRefresh = async() => {
        const freshEntity = await fetch()
        console.log("refreshed entity", freshEntity)
    }
    const handleInsertRoleType = (roletype) => {
        entity?.roletypes?.push(roletype)
    }

    if (loading) return (
        <LoadingSpinner text="Nahrávám" />
    )
    if (error) return (
        <ErrorHandler errors={error} />
    )
    if (!entity) return (
        <>{roletypelistId}<br/>Něco je špatně<br />{JSON.stringify(dispatchResult)}<br/>{children}</>
    )
    const roletypes = entity?.roletypes || []
    return (<>
            {roletypes.map(roletype => <div key={roletype.id}>
                <span className="btn btn-light">
                    <span className="btn btn-sm btn-outline-primary">{roletype.name}</span>
                    &nbsp;
                    <RoleTypeListTypeCDButton 
                        operation="D"
                        className="btn btn-sm btn-outline-danger"
                        roletypelist={{id: entity.id, type_id: roletype.id, name: roletype.name}}
                        onDone={handleInsertRoleType}
                    >
                        <TrashFill />
                    </RoleTypeListTypeCDButton>
                    
                </span>
                <br />
            </div>)}
            {/* <HorizontalLine>
                
            </HorizontalLine> */}
            <span className="btn btn-sm btn-light form-control">
                <RoleTypeListTypeCDButton 
                    className="btn btn-sm btn-outline-primary form-control"
                    roletypelist={roletypelist}
                    operation="C"
                    onDone={handleInsertRoleType}
                >
                    Přidat roli
                </RoleTypeListTypeCDButton>
            </span>
            {/* <br />
            {JSON.stringify(roletypes)} */}
        
    </>)
}