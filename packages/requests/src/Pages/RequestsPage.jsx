import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { useState } from "react"
import { createLazyComponent, InfiniteScroll } from "@hrbolek/uoisfrontend-shared"
import { RequestMediumCard } from "../Components"
import { RequestPageNavbar } from './RequestPageNavbar'
import { RequestsReadAsyncAction } from './Queries/RequestsReadAsyncAction'

const RequestsVisualiser = ({items}) => {
    return (
        <>{items.map( 
                request => <Col key={request.id}>
                    <RequestMediumCard request={request} />
                </Col>
           )}
        </>
    )
}

export const RequestsPageContent = ({requests, ...props}) => {
    const [settings, setSettings] = useState({mode: "cards"})
    return (<>
        <RequestPageNavbar />
        {/* {JSON.stringify(props)}<br /> */}
        <Row>
            <InfiniteScroll 
                Visualiser={RequestsVisualiser}
                preloadedItems={requests} 
                actionParams={{skip: 0, limit: 10}} 
                asyncAction={RequestsReadAsyncAction} />
        </Row>
    </>)    
}

export const RequestsPageContentLazy = createLazyComponent(RequestsPageContent, "requests", RequestsReadAsyncAction)

export const RequestsPage = () => {
    const requests = {}
    return <RequestsPageContentLazy requests={requests}/>
}