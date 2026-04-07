import { createAsyncGraphQLAction, useAsyncAction, useFreshItem } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent, LazyRender, useMe } from "@hrbolek/uoisfrontend-shared"
import { UserLink, UserMediumCard, UserMediumContent } from "@hrbolek/uoisfrontend-ug"
import { ItemUpdateAsyncAction } from "../Queries/ItemUpdateAsyncAction"

const StudentQuery = 
`
query StudentQuery($id: UUID!) {
    result: userById(id: $id) {
        __typename
        id
        name
        surname
        fullname
        email
    }
}
`

const StudentContent = ({user}) => {
    return (
        <>
        <UserLink user={user} />
        <UserMediumContent user={user}>
            
        </UserMediumContent>
        </>
    )
}

const StudentReadAsyncAction = createAsyncGraphQLAction(StudentQuery)
// const StudentWithRead = createLazyComponent(UserMediumCard, "user", StudentReadAsyncAction)
const StudentWithRead = createLazyComponent(StudentContent, "user", StudentReadAsyncAction)

export const Student = ({item, value}) => {
    // value= null
    const { me } = useMe()
    const { fetch, loading, error } = useAsyncAction(ItemUpdateAsyncAction, item, { deferred: true });
  
    const onClick = () => {
        fetch({ ...item, value: me.id })
    };
    // console.log("me", me)
    return (
        <LazyRender>
            {value?
                <StudentWithRead user={{id: value}} />:""   
            }
            {loading && <span>Ukládám</span>}
            {error && <span>Chyba {JSON.stringify(error)}</span>}
            <div className="screen-only">
                < br/>
                <button className="form-control btn btn-warning" onClick={onClick}>Zapsat mě</button>
            </div>
        </LazyRender>
    )
}