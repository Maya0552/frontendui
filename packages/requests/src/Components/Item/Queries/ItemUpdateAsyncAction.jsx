import { createAsyncGraphQLAction } from '@hrbolek/uoisfrontend-gql-shared';

const RequestReadQuery = `
query RequestReadQuery($id: UUID!) {
    result: requestById(id: $id) {
     __typename
    id
    name
    histories {
      __typename
      id
      name
      form {
        ...Form
      }
      request {
        __typename
        id
        name
      }
      createdby { id fullname }
      state {
        id
        name
      }
    }
    form {
      __typename
      ...Form
    }
  }
}

fragment Form on FormGQLModel {
        __typename
      id
      name
      state {
        __typename
        id
        name
        readerslistId
      }
      sections {
        __typename
        id
        name
        order
        parts {
          __typename
          id
          name
          order
          items {
            __typename
            lastchange
            id
            name
            value
            order
            type {
              id
              name
            }
          }
        }
      }

}
`;
const RequestReadAsyncAction = createAsyncGraphQLAction(RequestReadQuery);
const ItemReadQuery = `
`;
const ItemUpdateQuery = `
mutation ItemUpdateQuery($id: UUID!, $lastchange: DateTime!, $name: String, $name_en: String, $value: String) {
  result: formItemUpdate(item: {id: $id, lastchange: $lastchange, value: $value, name: $name, nameEn: $name_en}) {
    __typename
    ...ItemWithRequest
    ... on FormItemGQLModelUpdateError {
      __typename
      Entity {
        ...ItemWithRequest
      }
      msg
      failed
      input
    }
  }
}

fragment ItemWithRequest on FormItemGQLModel {
  __typename
  id
  lastchange
  name
  value
  part {
    id
    section {
      id
      form {
        id
        request {
          id
        }
      }
    }
  }
  changedby {
    id email
  }
}
`;
export const ItemUpdateAsyncAction = createAsyncGraphQLAction(ItemUpdateQuery,
  // (jsonResult) => (dispatch, getState, next) => {
  //   const item = jsonResult?.data?.result;
  //   // console.log("ItemUpdateAsyncAction", item)
  //   const request = item?.part?.section?.form?.request;
  //   // dispatch(RequestReadAsyncAction(request)) // TODO integrate with mutation
  //   if (item) return next(request);
  // },
  // RequestReadAsyncAction
);
