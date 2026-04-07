import { GeneratedContentBase } from "../../../../_template/src/Base/Pages/Page"
import { UpdateBody } from "../Mutations/Update"
import { PageItemBase } from "./PageBase"

const Demo = ({}) => {
    return (<>LO</>)
}

export const PageUpdateItem = ({ 
    SubPage=UpdateBody,
    ...props
}) => {
    return (
        <PageItemBase 
            SubPage={SubPage}
            // SubPage={Demo}
            {...props}
        />
    )
}