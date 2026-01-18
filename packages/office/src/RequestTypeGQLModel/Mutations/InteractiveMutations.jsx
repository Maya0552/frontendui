import { CardCapsule, VectorItemsURI } from "../Components"
import { CreateButton, CreateLink } from "./Create"
import { UpdateButton, UpdateLink } from "./Update"
import { ProxyLink } from "../../../../_template/src/Base/Components/ProxyLink"
import { DeleteButton } from "./Delete"


import { CreateButton as CreateRequestButton } from "../../RequestGQLModel/Mutations/Create"


export const PageLink = ({ children, preserveHash = true, preserveSearch = true, ...props }) => {
    return (
        <ProxyLink
            to={VectorItemsURI}
            preserveHash={preserveHash}
            preserveSearch={preserveSearch}
            {...props}
        >
            {children}
        </ProxyLink>
    );
};

export const InteractiveMutations = ({ item }) => {
    return (
        <CardCapsule item={item} title="Nástroje">
            <PageLink className="btn btn-outline-success">Seznam typů žádostí</PageLink>
            <UpdateLink className="btn btn-outline-success" item={item}>Upravit tento typ žádosti</UpdateLink>
            {/* <UpdateButton className="btn btn-outline-success" item={item}>Upravit Dialog</UpdateButton> */}
            <CreateButton className="btn btn-outline-success" rbacitem={{}}>Vytvořit nový typ žádosti</CreateButton>
            <DeleteButton className="btn btn-outline-danger" item={item}>Odstranit tento typ žádosti</DeleteButton>


            <CreateRequestButton
                className="btn btn-outline-warning" 
                item={{
                    name: `Požadavek (${item?.name})`,
                    requestTypeId: item?.id
                }}
            >
                Vytvořit požadavek
            </CreateRequestButton>
        </CardCapsule>
    )
}
