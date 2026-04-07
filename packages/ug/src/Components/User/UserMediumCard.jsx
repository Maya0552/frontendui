import { CardCapsule } from '@hrbolek/uoisfrontend-shared'

import { UserMediumContent } from './UserMediumContent'
import { UserCardCapsule } from './UserCardCapsule'

export const UserMediumCard = ({user, children, id=null}) => {
    return (
        <UserCardCapsule user={user} id={id}>
            <UserMediumContent user={user} />
            {children}
        </UserCardCapsule>
    )
}