import { useState } from 'react'
import { createAsyncGraphQLAction, createQueryStrLazy, transformAndCacheGraphQLVectorResult, updateItemsFromGraphQLResult, useAsyncAction } from "@hrbolek/uoisfrontend-gql-shared"
import { CreateDelayer, ErrorHandler, Input, LoadingSpinner, Label } from "@hrbolek/uoisfrontend-shared"

const GroupReadPageQuery = createQueryStrLazy(
`query GroupQueryRead($skip: Int, $limit: Int, $orderby: String = "name", $where: GroupInputWhereFilter) {
  result: groupPage(skip: $skip, limit: $limit, orderby: $orderby, where: $where) {
    __typename
    name
    email
    abbreviation
  }
}`    
)

const CacheId = "f9fcea7a-f469-485c-a543-e7de6c3daf19"
const GroupPageReadAsyncAction = createAsyncGraphQLAction(
    GroupReadPageQuery,
    updateItemsFromGraphQLResult,
    transformAndCacheGraphQLVectorResult(CacheId)
)

export const InputGroup = ({onChange=(group)=>null, onBlur=(group)=>null, id, label="", defaultValue, className="", ...props}) => {
    const { loading, error, fetch } = useAsyncAction(GroupPageReadAsyncAction, {}, {deferred: true})
    const [searchStr, setSearchStr] = useState("")
    const [groups, setGroups] = useState([])
    const [selected, setSelected] = useState(defaultValue?.id?defaultValue:null)
    const [delayer] = useState(() => CreateDelayer())
    const loadGroups = async(searchStr) => {
        const where = {"_or":[
            {"name": {"_ilike": `%${searchStr}%`}}, 
            // {"abbreviation": {"_ilike": `%${searchStr}%`}}
        ]}
        const data = await fetch({where})
        const options = data?.data?.result?.options
        // console.log("group data", options)
        setGroups(prev => options || [])
    }
    const handleChange = (e) => {
        const searchStr = e.target.value
        setSearchStr(prev => searchStr)
        if(searchStr.length > 3)
            delayer(() => loadGroups(searchStr))
    }
    
    const handleSelectGroup = (group) => {
        // setSearchStr(group.fullname);
        // setGroups([]); // Clear suggestions
        setSelected(prev => group)
        const e = {target: {id, value: group.id, group}}
        onChange(e); // Trigger the onChange callback
    };

    const classnames = className.split(" ")
    const buttonclassnames = ["btn btn-outline-success"].concat(classnames).filter((item, index, self) => self.indexOf(item) === index);
    const buttomclassname = buttonclassnames.join(" ")
    return (<div id="groupdynamicselect" style={{ position: "relative" }}>
        {loading && <LoadingSpinner />}
        {error && <ErrorHandler errors={error} />}
        {selected && (<Label title={label}>
            <span className={buttomclassname} onClick={() => setSelected(null)}>
                {selected.name} {selected.surname}
            </span>
            {/* <span className='btn btn-outline-success' onClick={onChange}><PlusLg /></span> */}
        </Label>)}
        {!selected && <>
            <Input id={id} label={label} className={className} {...props} defaultValue={searchStr} onChange={handleChange} onBlur={handleChange} />
            <div id="grouphints" 
                style={{
                    position: "absolute",
                    top: "100%", // Positioned below the input
                    left: 0,
                    right: 0,
                    zIndex: 1000, // Ensure it's above other elements
                    backgroundColor: "white",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
            >
                {groups.map(group => 
                <div 
                    key={group.id}
                    onClick={() => handleSelectGroup(group)}
                    style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #f0f0f0",
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#f9f9f9")}
                    onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "white")}
                >
                    <span>
                        {group.name}
                    </span>
                </div>)}
            </div>
        </>}
    </div>
    )
}