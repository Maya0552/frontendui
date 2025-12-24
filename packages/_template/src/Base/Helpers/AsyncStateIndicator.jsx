import { ErrorHandler, LoadingSpinner } from "@hrbolek/uoisfrontend-shared"

export const AsyncStateIndicator = ({error, loading, text}) => {
    return (<>
        {error && <ErrorHandler errors={error} />}
        {loading && <LoadingSpinner text={text} />}
    </>)
}