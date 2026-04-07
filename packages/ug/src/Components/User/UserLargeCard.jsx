import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { UserMediumCard } from './UserMediumCard'
import { UserGroupsLargeContent } from './Vectors/Groups'
import { UserCardCapsule } from './UserCardCapsule'
import { UserRolesCard } from './Vectors'

export const UserLargeCard = ({user, children, title=<><PersonFill /> <UserLink user={user } /></>}) => {
    return (
    <>
        <UserCardCapsule user={user} title={title} >
        </UserCardCapsule>
            <Row>
                <Col xl={3} md={12}>
                    <UserMediumCard user={user}/>
                    <UserGroupsLargeContent user={user} />
                </Col>
                <Col xl={9} md={12}>
                    <UserRolesCard user={user} />
                    <UserMediumCard user={user} id="basic"/>
                    {children}
                </Col>
            </Row>
       
    </>
    )
}