import { GroupMediumContent } from './GroupMediumContent'
import { GroupCardCapsule } from './GroupCardCapsule'

export const GroupMediumCard = ({group, children}) => {
    return (
        <GroupCardCapsule group={group}>
            <GroupMediumContent group={group} />
            {children}
        </GroupCardCapsule>
    )
}