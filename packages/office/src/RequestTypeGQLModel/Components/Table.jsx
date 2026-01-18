import { Link } from "../../../../_template/src/Base/Components"
import { formatDateTime } from "../../../../_template/src/Base/Components/Attribute"
import { Table as BaseTable, CellName, KebabMenu } from "../../../../_template/src/Base/Components/Table" 
import { UpdateLink } from "../Mutations/Update"
import { DeleteButton } from "../Mutations/Delete"
import { CreateButton } from "../Mutations/Create"

const table_def = {
    name: {
        label: "Název",
        component: CellName
    },
    // requestType: {
    //     label: "Typ požadavku",
    //     component: ({row }) => <CellName row={row?.requestType} />
    // },
    changed: {
        label: "Změněno",
        component: ({row }) => <td><Link item={row?.createdby ?? row?.changedby} /> @ {formatDateTime(row?.lastchange)}</td>
    },
    // state: {
    //     label: "Stav",
    //     component: ({row }) => <CellName row={row?.state} />
    // }
    tools: {
            label: "Nástroje",
            component: ({ row }) => <td><KebabMenu actions={[
                { 
                    children: <UpdateLink item={row} className="btn btn-sm btn-outline-secondary border-0 text-start w-100">Editovat</UpdateLink> 
                },
                { 
                    children: <DeleteButton item={row} className="btn btn-sm btn-outline-secondary border-0 text-start w-100">Odstranit</DeleteButton>
                },
                { 
                    children: <CreateButton item={row} className="btn btn-sm btn-outline-secondary border-0 text-start w-100">Vytvořit požadavek</CreateButton>
                },
            ]} /></td>

    }
}

export const Table = ({ data }) => {
    return (
        <BaseTable data={data} table_def={table_def}/>
    )
}