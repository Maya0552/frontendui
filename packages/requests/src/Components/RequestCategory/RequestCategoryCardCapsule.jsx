import { CardCapsule, SimpleCardCapsule } from "@hrbolek/uoisfrontend-shared"

export const RequestCategoryCardCapsule = ({requestcategory, ...props}) => {
    return (
        <SimpleCardCapsule title={`Kategorie ${requestcategory?.name}`} {...props} />
    )
}
