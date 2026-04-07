import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"

const ProgramQueryRead = `
query ProgramQueryRead($id: id) {
    result: acProgramById(id: $id) {
        __typename

    }
}
`
const ProgramReadAsyncAction = createAsyncGraphQLAction(ProgramQueryRead)
const ProgramPageContent = ({program}) => {
    return (
        <>
        Program {JSON.stringify(program)}
        </>
    )
}

const ProgramPageContentLazy = createLazyComponent(ProgramPageContent, "program", ProgramReadAsyncAction)
export const ProgramPage = () => {
    const {id} = useParams()
    const program = {id}
    return <ProgramPageContentLazy program={program} />
}