import { createQueryStrLazy } from "@hrbolek/uoisfrontend-gql-shared"

const LinkFragmentStr = `
fragment Link on DigitalSubmissionGQLModel  {
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
`

const MediumFragmentStr = `
fragment Medium on DigitalSubmissionGQLModel  {
    ...Link
    rbacobject {
        ...RBRoles
    }
    form {
        __typename
        id
        name
    }   
        
    sections {
        ...DigitalSubmissionSection
    }
}
`

const LargeFragmentStr = `
fragment Large on DigitalSubmissionGQLModel  {
    ...Medium
    
    sections {
        ...DigitalSubmissionSection
        fields {
            ...DigitalSubmissionField
        }
        sections {
            ...DigitalSubmissionSection
            fields {
                ...DigitalSubmissionField
            }
            sections {
                fields {
                    ...DigitalSubmissionField
                }
                ...DigitalSubmissionSection
            }
        }
    }
}

fragment DigitalSubmissionSection on DigitalSubmissionSectionGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  createdby { __typename id fullname }
  changedby { __typename id fullname  }
  rbacobject { ...RBRoles }
  path
  index
  stateId
  sectionId
  formSectionId
  submissionId
  section { __typename id }
  formSection { 
    __typename 
    id 
    name 
    label 
    labelEn 
    description 
    
    order
    repeatableMin
    repeatableMax
    repeatable
}
  submission { __typename id name }
  sections { __typename id }
  fields { __typename id }
}

fragment DigitalSubmissionField on DigitalSubmissionFieldGQLModel {
  __typename
  id
  lastchange
  created
  createdbyId
  changedbyId
  rbacobjectId
  createdby { __typename id fullname }
  changedby { __typename id fullname }
  rbacobject { __typename ...RBRoles }
  path
  value
  fieldId
  submissionId
  sectionId
  field { __typename id name typeId }
  section { __typename id }
  stateId
  state { __typename id name  }
  }
`

const RoleFragmentStr = `
fragment Role on RoleGQLModel {
    __typename
    id
    lastchange
    created
    createdbyId
    changedbyId
    rbacobjectId
    createdby { id __typename }
    changedby { id __typename }
    rbacobject { id __typename }
    valid
    deputy
    startdate
    enddate
    roletypeId
    userId
    groupId
    roletype { __typename id }
    user { __typename id fullname }
    group { __typename id name }
  }
`

const RBACFragmentStr = `
fragment RBRoles on RBACObjectGQLModel {
  __typename
  id
  currentUserRoles {
    __typename
    id
    lastchange
    valid
    startdate
    enddate
    roletype {
      __typename
      id
      name
    }
    group {
      __typename
      id
      name
      grouptype {
        __typename
        id
        name
      }
    }
  }
}`

export const RoleFragment = createQueryStrLazy(`${RoleFragmentStr}`)
export const RBACFragment = createQueryStrLazy(`${RBACFragmentStr}`)

export const LinkFragment = createQueryStrLazy(`${LinkFragmentStr}`)
export const MediumFragment = createQueryStrLazy(`${MediumFragmentStr}`, LinkFragment, RBACFragment)
export const LargeFragment = createQueryStrLazy(`${LargeFragmentStr}`, MediumFragment)
  