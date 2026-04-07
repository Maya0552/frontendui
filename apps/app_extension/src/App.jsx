import { useState } from "react"
import { loadPublications } from "./Publications/Queries"
import { PublicationList } from "./Publications"

import { AppCanvas } from '@hrbolek/uoisfrontend-gql-shared'
import { UserPageLazy } from "./User/Pages/UserPageLazy"

export const App = () => {
    // const [text, setText] = useState()
    // const onClick = async () => {
    //     const text = await loadPublications(633)
    //     console.log(text)
    //     setText(text)
    // }
    // useDispatch()
    return (
        <AppCanvas>
        {/* <div className="card">
            <button className="btn btn-primary" onClick={onClick}>Hello</button>
            <div>
                {JSON.stringify(text)}
                {text&&(
                    <PublicationList publications={text} />
                )}
            </div>
        </div> */}
            <UserPageLazy user={{uco: 633}} />
        </AppCanvas>
    )
}