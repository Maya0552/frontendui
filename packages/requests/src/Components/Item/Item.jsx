import { CardCapsule, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"
import { ItemIndex } from "./Visualisers"

const Default = ({item}) => {
    return (
        <div>
            ITEM: {JSON.stringify(item)}
        </div>
    )
}
export const Item = ({item, title=item.name, children}) => {
    const itemType = item?.type?.id
    const Visualiser = ItemIndex[itemType] || Default
    return (
        <SimpleCardCapsule title={title}>
            <Visualiser value={item.value} item={item}/>
            {children}
        </SimpleCardCapsule>
    )
}