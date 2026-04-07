import React from 'react'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, useFreshItem } from "@hrbolek/uoisfrontend-gql-shared"
import { UserCardCapsule } from "../UserCardCapsule"
import { GroupMediumCard } from "../../Group"

const UserGroupsQueryRead = `
query UserGroupsQueryRead($id: UUID!) {
    result: userById(id: $id) {
        __typename
        id
    memberships(limit: 100, where: {valid: {_eq: true}}) {
      id
      group {
        ...Group
      }
    }
  }
}

fragment Group on GroupGQLModel {
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
`

const UserGroupsReadAsyncAction = createAsyncGraphQLAction(UserGroupsQueryRead,
    processVectorAttributeFromGraphQLResult("memberships")
)

export const UserGroupsContent = ({user, children, Visualiser=GroupMediumCard}) => {
    const [user_] = useFreshItem(user, UserGroupsReadAsyncAction)
    const memberships = user_?.memberships || []
    const groups = memberships.map(
        membership => membership?.group
    ).filter(Boolean)
    return (
        <Row>
            {groups.map(
                group => <Col key={group?.id}>
                    <Visualiser group={group} />
                </Col>
            )}  
            {React.Children.map(
                children, (child) => 
                    <Col>
                        {child}
                    </Col>

            )}
        </Row>
    )
}

export const UserGroupsCard = ({user, children, ...props}) => {
    return (
        <UserCardCapsule user={user}>
            <UserGroupsContent user={user} {...props}>
                {children}
            </UserGroupsContent>
        </UserCardCapsule>
    )
}