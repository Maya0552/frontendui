import { RequestCategoryCardCapsule } from "./RequestCategoryCardCapsule";
import { RequestCategoryMediumContent } from "./RequestCategoryMediumContent";

export const RequestCategoryMediumCard = ({requestcategory, children}) => <>
    <RequestCategoryCardCapsule requestcategory={requestcategory}>
        <RequestCategoryMediumContent requestcategory={requestcategory} />
        {children}
    </RequestCategoryCardCapsule>
</>