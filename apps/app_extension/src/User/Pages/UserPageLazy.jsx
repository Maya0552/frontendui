import { useEffect, useState } from "react"
import { UserPublicationsPage } from "./UserPublicationsPage"
import { useDispatch } from "react-redux"
import { ReadUserAsyncAction } from "../Queries"

export const UserPageLazy = ({user}) => {
    const {uco} = user
    const [_user, setUser] = useState(user)
    const dispatch = useDispatch()
    useEffect(()=>{
        const userAction = ReadUserAsyncAction({user})
        const runner = async () => {
            const readedUser = await dispatch(userAction)
            setUser(readedUser)
        }
        runner()
    }, [uco])

    return (
        <UserPublicationsPage user={_user} />
    )
}