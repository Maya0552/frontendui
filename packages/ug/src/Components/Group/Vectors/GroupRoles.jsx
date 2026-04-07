import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { createAsyncGraphQLAction, hookGraphQLResult, processVectorAttributeFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"
import { InfiniteScroll } from "@hrbolek/uoisfrontend-shared";

import { GroupCardCapsule } from "../GroupCardCapsule"
import { RoleAddDeputyButton, RoleMediumCard } from '../../Role';
import { UserLink } from '../../User';


const GroupRolesQuery = `
query GroupRolesQuery($id: UUID!, $where: RoleInputWhereFilter, $skip: Int, $limit: Int ) {
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
}
`

const GroupRolesReadAsyncAction = createAsyncGraphQLAction(
    GroupRolesQuery,
    processVectorAttributeFromGraphQLResult("roles"),
    hookGraphQLResult(jsonResult => {
        const data = jsonResult?.data?.result?.roles;
        // console.log('GroupRolesReadAsyncAction', data)
        return data
    })    
)

const RoleCardVisualiser = ({role}) => {
    return (
        <Col>
            <RoleMediumCard role={role}>           
                {role?.user?.isThisMe &&<hr />}
                <RoleAddDeputyButton role={role} />
            </RoleMediumCard>
            {/* {JSON.stringify(role)} */}
        </Col>
    )
}

const RoleColVisualiser = ({role}) => {
    return (
        <>
            <Col>
                {role?.roletype?.name}
            </Col>
            {role?.user && <Col>
                <UserLink user={role?.user} />
            </Col>}
        </>
    )
}

const RolesVisualiser = ({items, Visualiser=RoleCardVisualiser}) => {
    return (
        <Row>
            {items.map(
                // role => <>{(role?.id)&&<RoleVisualiser role={role}/>}</>
                role => <Visualiser key={role?.id} role={role}/>
            )} 
        </Row>
    )
}

export const RolesToColsVisualiser = ({items}) => {
    return (
        <>
            {items.map(
                // role => <>{(role?.id)&&<RoleVisualiser role={role}/>}</>
                role => <Row key={role?.id}>
                        <RoleColVisualiser role={role}/>
                    </Row>
            )} 
        </>
    )
}

export const GroupRolesContent = ({group, children, Visualiser=RolesVisualiser, ...props}) => {  
    return (
        <InfiniteScroll 
            preloadedItems={group?.roles || []}
            Visualiser={Visualiser}
            actionParams={{...props, ...group}}
            asyncAction={GroupRolesReadAsyncAction}
        >
            {children}
        </InfiniteScroll>
    )
}

export const GroupRolesCard = ({group, Visualiser=RolesVisualiser, ...props}) => {
    return (
        <GroupCardCapsule group={group} >
            <GroupRolesContent group={group} Visualiser={RolesVisualiser} {...props}>

            </GroupRolesContent>
        </GroupCardCapsule>
    )
}