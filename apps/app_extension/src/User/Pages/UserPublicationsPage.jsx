import { UserLargeCard } from "../Components"
import { UserPublications } from "../Vectors/UserPublications"

export const UserPublicationsPage = ({user}) => {
    return (
        <UserLargeCard user={user}>
            <UserPublications user={user} />
        </UserLargeCard>
    )
}