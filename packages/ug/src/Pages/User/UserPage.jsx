import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useParams } from 'react-router'
import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent, ComponentSentinel, ProxyLink, MyNavbar, LeftColumn, MiddleColumn, HashContainer, LazyRender } from "@hrbolek/uoisfrontend-shared"
import { UserLargeCard } from "../../Components/User/UserLargeCard"
import { GroupSchemaLazy } from '../../Components/Group/GroupSchema'
import { UserGroupsLargeContent, UserLink, UserMediumCard, UserMembershipsCard, UserRolesCard } from '../../Components'
import { UserEventsCard } from '../../Components/User/Vectors/UserEventsCard'
import { EmojiSmile, EmojiSmileFill, Person, PersonBadgeFill, PersonCircle, PersonFill } from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import { UserPageNavbar } from './UserPageNavbar'
import { UserMembershipsGroups } from '../../Components/User/Vectors/Memberships'
import { UserCardCapsule } from '../../Components/User/UserCardCapsule'
import { UserGroupsCard } from '../../Components/User/Vectors/UserGroups'


const UserQueryRead = `
query UserQueryRead($id: UUID!) {
    result: userById(id: $id) {
        __typename
        id
        name
        surname
        fullname
        email
        # university: memberOf(grouptypeId: "cd49e152-610c-11ed-9f29-001a7dda7110") {
        #     __typename
        #     id
        #     name
        #     }        
        groups(
        where: {_and: [ 
            {group: {grouptype: {category_id: {_eq: "be2b2dcc-4bfe-4035-99e8-dd6d6f01562e"}}}},
            {group: {valid: {_eq: true}}},
            {valid: {_eq: true}},
        ]
        }
        ) {
            __typename
            id
            name
            type {
                id
                name
                category {
                    id
                    name
                }
            }
        }
    }
}
`

// const TitleButton = ({user, segment, label}) => {
//     const urlbase = (segment) => `/ug/user/${segment}/${user?.id}`
//     return (
//         <span className="btn btn-sm btn-outline-secondary" style={{ marginLeft: '8px' }}>
//             <ProxyLink to={urlbase(segment)}>{label}</ProxyLink>
//         </span>
//     )
// }

// const UserPageTitle = ({user}) => {
//     return (
//         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             {/* Left-aligned content */}
//             <div>
//                 <Navbar.Brand>
//                     <PersonFill /> <UserLink user={user} />
//                 </Navbar.Brand>
                
//             </div>
//             {/* Right-aligned buttons */}
//             <div>
                
//                 <TitleButton user={user} segment={"roles"} label={"Role"} />
//                 <TitleButton user={user} segment={"groups"} label={"Skupiny"} />
//                 <Nav.Divider />
//                 <div className="vr mx-2"></div> {/* Vertical delimiter */}
//                 <div style={{ borderLeft: '1px solid #ddd', height: '24px', margin: '0 8px' }}></div>
//                 <TitleButton user={user} segment={"events"} label={"Rozvrh"} />
//                 <TitleButton user={user} segment={"granting"} label={"Garance"} />
//                 <TitleButton user={user} segment={"learning"} label={"Výuka"} />
                
//                 {/* <TitleButton user={user} segment={"requests"} label={"Požadavky"} /> */}
//                 <TitleButton user={user} segment={"projects"} label={"Projekty"} />
//                 <TitleButton user={user} segment={"publications"} label={"Výsledky"} />
//             </div>
//         </div>
//     );
// }



const UserPageContent = ({user}) => {
    return (
        <>
        <UserPageNavbar user={user } />
        <Row>
            <LeftColumn>
                <UserMediumCard user={user} />
                {/* <UserGroupsLargeContent user={user} /> */}
            </LeftColumn>
            <MiddleColumn>
                {/* <UserRolesCard user={user} /> */}

                <HashContainer>
                    <Row id="events">
                        <Col>
                            Rozvrh
                        </Col>
                    </Row>
                    <Row id="memberships">
                        <Col>
                            {/* <UserCardCapsule user={user} id={"memberships"}>
                                <UserMembershipsGroups user={user} />
                            </UserCardCapsule> */}
                            <UserMembershipsCard user={user} />
                        </Col>
                    </Row>
                    <Row id="groups">
                        <Col>
                            <LazyRender>
                                <UserGroupsCard user={user} />
                            </LazyRender>
                        </Col>
                    </Row>            
                    <Row id="roles">
                        <Col>
                            <LazyRender>
                                <UserRolesCard user={user} />
                            </LazyRender>
                        </Col>
                    </Row>            
                    
                    <Row id="publications">
                        <Col>
                            Publikace
                        </Col>
                    </Row>
                    <Row id="projects">
                        <Col>
                            Projekty
                        </Col>
                    </Row>
                </HashContainer>
            </MiddleColumn>
        </Row>      
        </>

    )
}

const UserReadAsyncAction = createAsyncGraphQLAction(UserQueryRead)
const UserPageContentLazy = createLazyComponent(UserPageContent, "user", UserReadAsyncAction)
export const UserPage = () => {
    const { id } = useParams()
    const user = {id}
    return (
        // <UserPageContentLazy user ={user} /> 
        <ComponentSentinel meCondition={me => me?.email?.includes("world")}>
            <UserPageContentLazy user ={user} />
        </ComponentSentinel>
    )
}