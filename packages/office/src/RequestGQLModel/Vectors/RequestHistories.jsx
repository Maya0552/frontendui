import { useEffect, useState } from "react"
import { Link, SimpleCardCapsule } from "../../../../_template/src/Base/Components"
import { useAsyncThunkAction } from "../../../../dynamic/src/Hooks"
import { formatDateTime } from "../../../../_template/src/Base/Components/Attribute"

export const RequestHistories = ({ item }) => {
    const { id, lastchange, histories } = item || {}
    const ctx = useAsyncThunkAction(null, {id}, {deferred: true})
    const [h, setHistories] = useState(histories || [])
    useEffect(() => {
        if (histories) {
            setHistories(histories)
            return
        }
        const runner = async () => {
            const result = await ctx.run()
            console.log("RequestHistories.useEffect", result)
            const newHistories = result?.entity?.histories || []
            // setHistories(newHistories)
        }
        runner()
    }, [id, lastchange, histories])
    return (
        <SimpleCardCapsule title="Historie">
            <table className="table">
                <thead>
                    <tr>
                        <th>Formulář @ Stav</th>
                        <th>Kdo @ Kdy</th>
                        <th>Poznámka</th>
                    </tr>
                </thead>
                <tbody>
                    {h.map((history)=>(<tr key={history?.id}>
                        <td>
                            <Link item={history?.submission} /> @ <Link item={history?.state} />
                        </td>
                        <td>
                            <Link item={history?.changedby ?? history?.createdby} /> @ {formatDateTime(history?.lastchange)}
                        </td>
                        <td>{history?.name}</td>
                        
                    </tr>))}
                </tbody>
            </table>
        </SimpleCardCapsule>
    )
}