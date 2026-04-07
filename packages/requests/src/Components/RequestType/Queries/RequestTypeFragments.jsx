import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { GroupLinkFragment } from "@hrbolek/uoisfrontend-ug";
import { FormLargeFragment } from "../../Form/Queries/FormFragments";

const RequestTypeRead = `
query RequestTypeRead($id: UUID!) {
  result: requestTypeById(id: $id) {
    ...RequestType
  }
}



fragment GroupLink on GroupGQLModel {
  __typename
  id
  name
}
`;

const RequestTypeLinkFragment = createQueryStrLazy (
`fragment RequestTypeLink on RequestTypeGQLModel {
    __typename
    id
    name
    nameEn
}`  
)

export const RequestTypeReadPage = createQueryStrLazy(`
query RequestTypeReadPage($skip: Int, $limit: Int, $orderby: String ="name", $where: RequestTypeInputFilter) {
  result: requestTypePage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    ...RequestTypeLink
  }
}`,
  RequestTypeLinkFragment);
  

export const RequestTypeLargeFragment = createQueryStrLazy(
`fragment RequestTypeLargeFragment on RequestTypeGQLModel {
  __typename
  id
  lastchange
  name
  nameEn
  groupId
  group {
    ...GroupLink
  }
  templateFormId
  templateForm {
    ...FormLarge
  }
  statemachine {
    
  }
}`,
    GroupLinkFragment, FormLargeFragment
)