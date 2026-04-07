import { createAsyncGraphQLAction, useFreshItem } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent, LazyRender } from "@hrbolek/uoisfrontend-shared"

const TemplateQuery = 
`
query TemplateQuery($id: UUID!) {
    result: templateById(id: $id) {
        __typename
        id
    }
}
`

const TemplateReadAsyncAction = createAsyncGraphQLAction(TemplateQuery)
// const TemplateWithRead = createLazyComponent(UserMediumCard, "user", TemplateReadAsyncAction)

export const Template = ({value, item}) => {
    return (
        <LazyRender>
            {JSON.stringify(item)}<br />
            Probably render "TemplateWithRead template={{id: value}}"
        </LazyRender>
    )
}