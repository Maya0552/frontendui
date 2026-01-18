import { Link } from "../../../../_template/src/Base/Components"
import { formatDateTime } from "../../../../_template/src/Base/Components/Attribute"
import { Table as BaseTable, CellName } from "../../../../_template/src/Base/Components/Table" 


const table_def = {
    name: {
        label: "Název",
        component: CellName
    },
    requestType: {
        label: "Typ požadavku",
        component: ({row }) => <CellName row={row?.requestType} />
    },
    changed: {
        label: "Změněno",
        component: ({row }) => <td><Link item={row?.createdby ?? row?.changedby} /> @ {formatDateTime(row?.lastchange)}</td>
    },
    state: {
        label: "Stav",
        component: ({row }) => <CellName row={row?.state} />
    }
}

export const Table = ({ data }) => {
    return (
        <BaseTable data={data} table_def={table_def}/>
    )
}