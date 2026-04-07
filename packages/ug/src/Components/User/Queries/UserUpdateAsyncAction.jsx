import { createAsyncGraphQLAction, createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { UserLinkFragment } from "./UserFragments";

export const UserUpdateMutation = createQueryStrLazy(
`mutation UserUpdate($id: UUID!, $lastchange: DateTime!, $name: String, $surname: String) {
  result: userUpdate(user: {id: $id, lastchange: $lastchange, name: $name, surname: $surname}) {
    __typename
    ...on UserGQLModelUpdateError {
      failed
      msg
      input
      Entity {
        ...UserLink
      }
    }
    ...UserLink
  }
}
`, 
    UserLinkFragment
)

export const UserUpdateAsyncAction = createAsyncGraphQLAction(UserUpdateMutation)