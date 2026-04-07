import { useParams } from "react-router"

import { UserLargeCard } from "@hrbolek/uoisfrontend-ug/"
import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"

import { UserStudies } from "../../Components/User/Vectors/UserStudies"

const UserStudiesRead = `
query UserRead($id: UUID!) {
    result: userById(id: $id) {
        __typename
        id
        name
        surname
        fullname
        email

    studies {
      __typename
      id
      registerNumber
      program {
        __typename
        id
        name
        type {
          id
          name
          level {
            id
            name
          }
          form {
            id
            name
          }
          language {
            id
            name
          }
          title {
            id
            name	
          }
        }
      }
      messages {
        __typename
        id
        name
        description
        date
        
      }
    }
        
    }
}
`
export const UserStudiesAsyncAction = createAsyncGraphQLAction(UserStudiesRead)
const UserStudiesPageContent = ({user}) => {
    return (
        <UserLargeCard user={user}>
            <UserStudies user={user} />
        </UserLargeCard>
    )
}
const UserStudiesPageContentLazy = createLazyComponent(UserStudiesPageContent, "user", UserStudiesAsyncAction)

export const UserStudiesPage = () => {
    const { id } = useParams()
    const user = { id }
    return (
        <UserStudiesPageContentLazy user={user} />
    )
}