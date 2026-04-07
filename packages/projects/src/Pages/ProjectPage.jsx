import { createAsyncGraphQLAction } from "@hrbolek/uoisfrontend-gql-shared"
import { createLazyComponent } from "@hrbolek/uoisfrontend-shared"
import { useParams } from "react-router"

const ProjectQueryRead = `
query ProjectQueryRead($id: id) {
    result: projectById(id: $id) {
        __typename

    }
}
`
const ProjectReadAsyncAction = createAsyncGraphQLAction(ProjectQueryRead)
const ProjectPageContent = ({project}) => {
    return (
        <>
        Project {JSON.stringify(project)}
        </>
    )
}

const ProjectPageContentLazy = createLazyComponent(ProjectPageContent, "project", ProjectReadAsyncAction)
export const ProjectPage = () => {
    const {id} = useParams()
    const project = {id}
    return <ProjectPageContentLazy project={project} />
}