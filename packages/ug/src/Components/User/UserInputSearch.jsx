import { useSearchParams } from "react-router"
import { useDispatch } from 'react-redux';
import { useState } from "react"
import { createAsyncGraphQLAction, hookGraphQLResult, updateItemsFromGraphQLResult } from "@hrbolek/uoisfrontend-gql-shared"

const UserSearchQuery =
`
query UserSearch($skip: Int, $limit: Int, $where: UserInputWhereFilter) {
  result: userPage(skip: $skip, limit: $limit, where: $where) {
    __typename
    id
    fullname
  }
}
`

const UserSearchAsyncAction = createAsyncGraphQLAction(
    UserSearchQuery,
    updateItemsFromGraphQLResult,
    hookGraphQLResult(jsonResult => jsonResult?.data?.result || [])
)

export const UserInputSearchResult = ({result, onSelect}) => {
    return (
        <span className="btn btn-outline-primary btn-sm" onClick={() => onSelect(result)}>{result?.fullname}</span>
    )
}

export const UserInputSearchResults = ({results, onSelect}) => {
    return (
        <>{results.map(
            result => <UserInputSearchResult key={result?.id} result={result} onSelect={onSelect}/>
        )}
        </>
    )
}

export const UserInputSearch = ({onSelect}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const dispatch = useDispatch()
    const [state, setState] = useState({
        searchphrase: searchParams.get('searchphrase') || "",
        results: [],
        selected: null
    })

    const load = async (searchphrase) => {
        if (searchphrase.length < 3) return []
        const found = await dispatch(UserSearchAsyncAction({
            // where: {fullname: {_ilike: `%${state.searchphrase}%`}}
            where: {_or: [{name: {_ilike: `%${searchphrase}%`}}, {surname: {_ilike: `%${searchphrase}%`}}] }
        }))
        setState(prev => ({...prev, results: found}))
    }

    const onChange = (e) => {
        const value = e.target.value
        setState(prev => {
            return {...prev, searchphrase: value}
        })
        // setSearchParams({...searchParams, searchphrase: value})
        // setState({...prev, searchphrase: value})
        load(value)
    }
    
    const _onSelect = (user) => {
        setState(prev => ({...prev, selected: user}))
        if (onSelect) onSelect(user)
    }

    return (
        <div>
            <input type="text" className={"form-control"} value={state.searchphrase} onChange={onChange} />
            {/* <hr />
            {JSON.stringify(state)} */}
            <hr />
            <UserInputSearchResults results={state.results} onSelect={_onSelect}/>
        </div>
    )
}