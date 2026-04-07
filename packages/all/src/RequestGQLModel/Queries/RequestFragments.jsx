import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { RBACObjectLargeFragment } from "../../RBACObjectGQLModel/Queries/RBACObjectFragments";

export const RequestLinkFragment = createQueryStrLazy(`
fragment RequestLinkFragment on RequestGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  name
  activeSubmissionId
  requestTypeId
  stateId
}
`);

export const RequestMediumFragment = createQueryStrLazy(`
fragment RequestMediumFragment on RequestGQLModel {
  ...RequestLinkFragment
  createdby {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    givenname
    middlename
    email
    firstname
    surname
    valid
    startdate
    enddate
    typeId
    isThisMe
    gdpr
    fullname
  }
  changedby {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    givenname
    middlename
    email
    firstname
    surname
    valid
    startdate
    enddate
    typeId
    isThisMe
    gdpr
    fullname
  }
  rbacobject {
    __typename
    id
    ...RBACObjectLargeFragment
  }
  activeSubmission {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    nameEn
    stateId
    formId
    parentId
  }
  state {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    name
    nameEn
    statemachineId
    writerslistId
    readerslistId
    order
  }
}
`, RequestLinkFragment, RBACObjectLargeFragment);

export const RequestLargeFragment = createQueryStrLazy(`
fragment RequestLargeFragment on RequestGQLModel {
  ...RequestMediumFragment
}
`, RequestMediumFragment);
