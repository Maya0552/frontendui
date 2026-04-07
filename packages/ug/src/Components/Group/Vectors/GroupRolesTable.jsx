import { createAsyncGraphQLAction, hookGraphQLResult, processVectorAttributeFromGraphQLResult, updateItemsFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { RolesTable } from "../../Role/RolesTable"
import { RoleAddDeputyButton } from "../../Role"
import { ComponentSentinel, DeleteButton } from "@hrbolek/uoisfrontend-shared"
import { TrashFill } from "react-bootstrap-icons"


const GroupRolesReadQuery = `
query GroupRolesReadQuery($id: UUID!, $where: RoleInputWhereFilter, $skip: Int, $limit: Int ) {
    result: groupById(id: $id) {
        __typename
        id
        name
        roles(skip: $skip, limit: $limit, where: $where, orderby: "startdate")
        {
            ...Roles
        }
    }
}

fragment Roles on RoleGQLModel {
    __typename
    id
    startdate
    enddate
    deputy
    roletype {
        id
        name
        category {
            id
            name
        }
    }
    user {
        id
        fullname
        isThisMe
    }
    group {
        id
        name
    }
    rbacobjectId
    rbacobject {
        roles {
            userId
            roletype {
                id
                name
            }
        }
    }
}
`

const GroupRolesReadAsyncAction = createAsyncGraphQLAction(
    GroupRolesReadQuery,
    processVectorAttributeFromGraphQLResult("roles"),
    // (jsonResult) => (dispatch, getState, next) => {
    //     const result = jsonResult?.data?.result
    //     const store = getState()
    //     const items = store.items
    //     const item = items[result.id]
    //     console.log("GroupRolesReadAsyncAction.0.old", item)
    //     console.log("GroupRolesReadAsyncAction.0.new", result)
    //     return next(jsonResult)
    // },
    // updateItemsFromGraphQLResult,
    // (jsonResult) => (dispatch, getState, next) => {
    //     const result = jsonResult?.data?.result
    //     const store = getState()
    //     const items = store.items
    //     const item = items[result.id]
    //     console.log("GroupRolesReadAsyncAction.1.old", item)
    //     console.log("GroupRolesReadAsyncAction.1.new", result)
    //     return next(jsonResult)
    // },
    hookGraphQLResult(jsonResult => {
        const roles = jsonResult?.data?.result?.roles
        return roles
    })
)

const PermissionTest = (rolenames) => (rbacobject) => {
    if (!rbacobject) {
        console.warn("rbacobject not set", rbacobject)
        return () => false
    }
    const roles = rbacobject?.roles || []
    const applicableroles = roles.filter(
        role => rolenames.includes(role?.roletype?.name)
    )
    // console.log("PermissionTest", applicableroles)
    if (applicableroles.length === 0) return () => false
    return (me) => {
        // console.log("PermissionTest.me", me)
        const userroles = applicableroles.filter(
            role => ((role?.userId === me?.id) || (role?.user?.id === me?.id))
        )
        const userrolenames = userroles.map(
            role => role?.roletype?.name || ""
        )
        const judgement = userrolenames.some(element => rolenames.includes(element))
        // console.log("PermissionTest.me", judgement, applicableroles, me)
        return judgement
    }
}
const RolePermissionTest = PermissionTest(["administrátor", "děkan", "rektor"])
const RoleDeputyStopButton = ({role}) => {
    const test = RolePermissionTest(role?.rbacobject)
    return (
        <>
        {role?.deputy && <ComponentSentinel meCondition={test}>
        {/* {true && <ComponentSentinel meCondition={test}>  */}
            <DeleteButton>Ukončit zástup</DeleteButton>
        </ComponentSentinel>}
        </>
    )
}

const RoleStopButton = ({role}) => {
    const test = RolePermissionTest(role?.rbacobject)
    return (
        <>
        {/* {role?.deputy && <ComponentSentinel meCondition={me => me?.id && me?.id === role?.user?.id}> */}
        {true && <ComponentSentinel meCondition={test}> 
            <DeleteButton>Odebrat roli</DeleteButton>
        </ComponentSentinel>}
        </>
    )
}

export const GroupRolesTable = ({group}) => {
    const roles = group?.roles || []
    return (
        <RolesTable 
            roles={roles}
            actionParams={{...group, skip: 0, limit: 10}}
            AsyncAction={GroupRolesReadAsyncAction}
            columnNames={["Uživatel", "Skupina", "Role", "Počátek", "Konec", "Zástup", "Nástroje" ]}
        >
            {/* <RoleCheck /> */}
            <RoleAddDeputyButton />
            <RoleDeputyStopButton />
            <RoleStopButton />
        </RolesTable>
    )
}