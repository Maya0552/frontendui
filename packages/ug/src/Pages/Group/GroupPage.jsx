import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { useParams } from 'react-router'
import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent, ComponentSentinel, LeftColumn, MiddleColumn, HashContainer } from "@hrbolek/uoisfrontend-shared"
import { GroupLargeCard, GroupMediumCard, GroupMembershipsCard, GroupRolesCard, GroupSubgroups, GroupUsersInfinite } from '../../Components'
import { GroupPageNavbar } from './GroupPageNavbar'
import { GroupRolesTable } from '../../Components/Group/Vectors/GroupRolesTable'
import { GroupRolesContent, RolesToColsVisualiser } from '../../Components/Group/Vectors/GroupRoles'

const GroupQueryRead = `
query GroupQueryRead($id: UUID!) {
    result: groupById(id: $id) {
        __typename
        id
        name
        mastergroup {
            __typename
            id
            name
        }
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
}
`

const GroupPageContent = ({group}) => {
    return (
        <>
            <GroupPageNavbar group={group} />
            <Row>
                <LeftColumn>
                    <GroupMediumCard group={group}>
                        <GroupRolesContent group={group} Visualiser={RolesToColsVisualiser}/>
                        
                    </GroupMediumCard>
                </LeftColumn>
                <MiddleColumn>
                    <HashContainer>                       
                        <Row id="roles">
                            <Col>
                                {/* {JSON.stringify(group?.roles)} */}
                                <GroupRolesTable group={group} />
                                {/* {JSON.stringify(group?.roles)} */}
                            </Col>
                        </Row>
                        <Row id="events">
                            <Col>
                                <GroupMediumCard group={group} />
                            </Col>
                        </Row>
                        <Row id="groups">
                            <Col>
                                <GroupSubgroups group={group} />
                            </Col>
                        </Row>
                        <Row id="memberships">
                            <Col>
                                <GroupMembershipsCard group={group} />
                            </Col>
                        </Row>
                        <Row id="publications">
                            <Col>
                                <GroupMediumCard group={group} />
                            </Col>
                        </Row>
                        <Row id="projects">
                            <Col>
                                <GroupMediumCard group={group} />
                            </Col>
                        </Row>
                    </HashContainer>
                </MiddleColumn>
            </Row>
        </>
    )
}

const GroupReadAsyncAction = createAsyncGraphQLAction(GroupQueryRead)
const GroupPageContentLazy = createLazyComponent(GroupPageContent, "group", GroupReadAsyncAction)
export const GroupPage = () => {
    const { id } = useParams()
    const group = {id}
    return ( 
        <ComponentSentinel meCondition={me => me?.email?.includes("world")}>
            <GroupPageContentLazy group ={group} />
        </ComponentSentinel>
    )
}