import { PersonFill } from 'react-bootstrap-icons'
import { CardCapsule } from '@hrbolek/uoisfrontend-shared'
import { UserLink } from './UserLink'

export const UserCardCapsule = ({user, children, title=<><PersonFill /> <UserLink user={user } /></>, id=null}) => {
    return (
        <CardCapsule title={title} id={id}>
            {children}
        </CardCapsule>
    )
}