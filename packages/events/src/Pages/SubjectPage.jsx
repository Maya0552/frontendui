import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"

const SubjectQueryRead = `
query SubjectQueryRead($id: id) {
    result: acSubjectById(id: $id) {
        __typename

    }
}
`
const SubjectReadAsyncAction = createAsyncGraphQLAction(SubjectQueryRead)
const SubjectPageContent = ({subject}) => {
    return (
        <>
        Subject {JSON.stringify(subject)}
        </>
    )
}

const SubjectPageContentLazy = createLazyComponent(SubjectPageContent, "subject", SubjectReadAsyncAction)
export const SubjectPage = () => {
    const {id} = useParams()
    const subject = {id}
    return <SubjectPageContentLazy subject={subject} />
}