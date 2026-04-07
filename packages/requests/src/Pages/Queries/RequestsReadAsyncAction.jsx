import { createAsyncGraphQLAction, updateItemsFromGraphQLResult } from '@hrbolek/uoisfrontend-gql-shared';

const RequestsReadQuery = `
query RequestsReadQuery($skip: Int, $limit: Int, $where: RequestInputFilter, $orderby: String)
{
  result: requestPage(skip: $skip, limit: $limit, where: $where, orderby: $orderby) {
    ...RequestLarge
  }
}

fragment RequestLarge on RequestGQLModel {
  __typename
  id
  name
  lastchange
  histories {
    __typename
    id
    request { ...RequestLink }
    form { ...FormLink }
    name
    changedby { ...UserLink }
    createdby { ...UserLink }
    created
    lastchange

  }
  state { id name }
  createdby { ...UserLink }
  changedby { ...UserLink }  
}

fragment UserLink on UserGQLModel {
  __typename
  id
  fullname
}

fragment RequestLink on RequestGQLModel {
  __typename
  id
  name
}

fragment FormLink on FormGQLModel {
  __typename
  id
  name
}
`;

export const RequestsReadAsyncAction = createAsyncGraphQLAction(
  RequestsReadQuery,
  updateItemsFromGraphQLResult,
  (jsonResult) => (dispatch, getState, next) => {
    const requests = jsonResult?.data?.result || [];
    return requests;
  }
);
