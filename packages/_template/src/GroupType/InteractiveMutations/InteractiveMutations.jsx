import { useNavigate } from "react-router"
import { CardCapsule, LinkURI } from "../Components"
import { VectorItemsURI } from "../Pages"
import { CreateLink, CreateBody } from "./Create"
import { Insert } from "./Insert"
import { Update, UpdateButton } from "./Update"
import { useEffect } from "react"

const PageLink = ({children, ...props}) => {
    const navigate = useNavigate()
    const onClick = (e) => {
        e.preventDefault()
        navigate(VectorItemsURI)
    }
    return <a {...props} href={VectorItemsURI} onClick={onClick}>{children}</a>
}
export const InteractiveMutations = ({ item }) => {
    return (
    <CardCapsule item={item} title="Nástroje">
        {/* <Update className="btn btn-outline-success" item={item} buttonLabel={"Update"} /> */}
        <UpdateButton className="btn btn-outline-success" item={item} buttonLabel={"Update"} />
        <Insert className="btn btn-outline-success" item={item} buttonLabel={"Insert"} />
        
        <CreateLink className="btn btn-outline-success" children="Nový" />
        <PageLink className="btn btn-outline-success">Stránka</PageLink>
    </CardCapsule>)
}
