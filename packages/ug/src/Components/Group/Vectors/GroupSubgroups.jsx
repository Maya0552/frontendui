import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { createAsyncGraphQLAction, processVectorAttributeFromGraphQLResult, updateItemsFromGraphQLResult, useFreshItem } from "@hrbolek/uoisfrontend-gql-shared"
import { LazyRender } from "@hrbolek/uoisfrontend-shared"
import { GroupMediumCard } from "../GroupMediumCard"

const GroupSubgroupsQueryRead =
`
query GroupQueryRead($id: UUID!) {
  result: groupById(id: $id) {
    __typename
    id
    subgroups(limit: 100, where: {valid: {_eq: true}}) {
        __typename
        id
        name
        type {
          id
          name
        }
    }
  }
}
`

const GroupSubgroupsReadAsyncAction = createAsyncGraphQLAction(
    GroupSubgroupsQueryRead,
    processVectorAttributeFromGraphQLResult("subgroups"),
    updateItemsFromGraphQLResult
)

const GroupRow = ({groups, Visualiser}) => {
    return (
        <Row>
            {groups.map(
                group => <Col key={group?.id}>
                    <Visualiser group={group} />
            </Col>
            )}
            
        </Row>

    )
}

export const GroupSubgroupsContent = ({group, Visualiser}) => {
    const [updatedGroup] = useFreshItem(group, GroupSubgroupsReadAsyncAction)
    const subgroups = updatedGroup?.subgroups || []
    
    const index = subgroups.reduce((acc, subgroup) => {
        const typeName = subgroup?.type?.name || "Unknown"; // Handle missing type.name
        if (!acc[typeName]) {
            acc[typeName] = [];
        }
        acc[typeName].push(subgroup);
        return acc;
    }, {});

    const fakulty = index["fakulta"] || []
    const katedry = index["katedra"] || []
    const studijni = index["studijní skupina"] || []
    const projekty = index["řešitelský kolektiv"] || []
    index["fakulta"] = []
    index["katedra"] = []
    index["studijní skupina"] = []
    index["řešitelský kolektiv"] = []
    index["garance programu"] = []
    return (
        // <Row>
        //     {subgroups.map(
        //         group => <Col key={group?.id}>
        //             <Visualiser group={group} />
        //         </Col>
        //     )}
        // </Row>
        <>
            {/* <h2>Katedry</h2> */}
            {fakulty.length > 0 && <GroupRow groups={fakulty} Visualiser={Visualiser} />}
            {katedry.length > 0 && <GroupRow groups={katedry} Visualiser={Visualiser} />}
            {studijni.length > 0 && <GroupRow groups={studijni} Visualiser={Visualiser} />}
            {/* {projekty.length > 0 && <GroupRow groups={projekty} Visualiser={Visualiser} />} */}
        
        {Object.entries(index).map(
            ([typeName, subGroups]) => <Row key={typeName}>
                {subGroups.map(
                    group => <Col key={group.id}>
                        <Visualiser group={group} />
                    </Col>
                )}
            </Row>
        )}
        
        {/* {JSON.stringify(index)} */}
        </>
    )
}

export const GroupSubgroups = ({group, Visualiser=GroupMediumCard}) => {
    return (
        <LazyRender>
            <GroupSubgroupsContent group={group} Visualiser={Visualiser} />
        </LazyRender>
    )
}