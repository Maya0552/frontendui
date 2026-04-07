import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared";
import { DigitalFormMediumFragment } from "../../DigitalFormGQLModel/Queries";
import { DigitalFormFieldMediumFragment } from "../../DigitalFormFieldGQLModel/Queries";

export const DigitalFormSectionLinkFragment = createQueryStrLazy(`
fragment DigitalFormSectionLinkFragment on DigitalFormSectionGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  name
  path
  label
  labelEn
  description
  formId
  sectionId
  order
  repeatableMin
  repeatableMax
  repeatable
}
`);

export const DigitalFormSectionMediumFragment = createQueryStrLazy(`
fragment DigitalFormSectionMediumFragment on DigitalFormSectionGQLModel {
  ...DigitalFormSectionLinkFragment
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
  }
}
`, DigitalFormSectionLinkFragment);

export const DigitalFormSectionLargeFragment = createQueryStrLazy(`
fragment DigitalFormSectionLargeFragment on DigitalFormSectionGQLModel {
  form {
    ...DigitalFormMediumFragment
    sections(limit: 1000) {
      ...DigitalFormSectionMediumFragment
      fields {
        ...DigitalFormFieldMediumFragment
      }
    }
      
  }
  ...DigitalFormSectionMediumFragment
  ...on DigitalFormSectionGQLModel {
      fields {
        ...DigitalFormFieldMediumFragment
      }
  }
}
`, DigitalFormSectionMediumFragment, DigitalFormMediumFragment, DigitalFormFieldMediumFragment);
