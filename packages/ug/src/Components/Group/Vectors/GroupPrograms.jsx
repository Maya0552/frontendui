import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, updateItemsFromGraphQLResult, useFreshItem } from "@hrbolek/uoisfrontend-gql-shared"
import { LazyRender } from "@hrbolek/uoisfrontend-shared"
import { GroupMediumCard } from "../GroupMediumCard"

const GroupProgramsQueryRead =
`
query  {
  result: acProgramPage {
    acProgramPage {
    __typename
    name
    type { id name }
    licencedGroup { id name }
  }
}
`

const GroupProgramsQueryAsyncAction = createAsyncGraphQLAction(
    GroupProgramsQueryRead,
    processVectorAttributeFromGraphQLResult("programs"),
    updateItemsFromGraphQLResult
)

export const GroupProgramsContent = ({group, Visualiser}) => {
    const [updatedGroup] = useFreshItem(group, GroupProgramsQueryAsyncAction)
    const programs = updatedGroup?.programs || []
    return (
        <Row>
            {programs.map(
                group => <Col key={group?.id}>
                    <Visualiser group={group} />
                </Col>
            )}
        </Row>
    )
}

export const GroupPrograms = ({group, Visualiser=GroupMediumCard}) => {
    return (
        <LazyRender>
            <GroupProgramsContent group={group} Visualiser={Visualiser} />
        </LazyRender>
    )
}