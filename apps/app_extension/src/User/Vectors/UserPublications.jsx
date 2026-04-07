import { PublicationMediumCard } from "../../Publications"
import { UserCardCapsule } from "../Components"

export const UserPublications = ({user}) => {
    const { publications=[] } = user

    return (
    <UserCardCapsule user={user}>
        {publications.map(
            publication => <PublicationMediumCard key={publication.id} publication={publication} />
        )}
    </UserCardCapsule>
    )
}