import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"

const SemesterQueryRead = `
query SemesterQueryRead($id: id) {
    result: acSemesterById(id: $id) {
        __typename

    }
}
`
const SemesterReadAsyncAction = createAsyncGraphQLAction(SemesterQueryRead)
const SemesterPageContent = ({semester}) => {
    return (
        <>
        Semester {JSON.stringify(semester)}
        </>
    )
}

const SemesterPageContentLazy = createLazyComponent(SemesterPageContent, "semester", SemesterReadAsyncAction)
export const SemesterPage = () => {
    const {id} = useParams()
    const semester = {id}
    return <SemesterPageContentLazy semester={semester} />
}