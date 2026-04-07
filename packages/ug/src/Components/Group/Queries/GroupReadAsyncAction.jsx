import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"

const GroupQueryRead = `
query GroupQueryRead($id: UUID!) {
    result: groupById(id: $id) {
        __typename
        id
        lastchange
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

export const GroupReadAsyncAction = createAsyncGraphQLAction(GroupQueryRead)