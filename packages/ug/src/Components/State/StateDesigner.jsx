import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const Transition = ({transition, ...props}) => <span {...props}>{transition.name}</span>

const TransitionList = ({transitions, children, ...props}) => {
    return (<>
        {transitions.map(transition => <Transition {...props} key={transition.id} />)}
        {children}
    </>)
}

export const StateDesigner = ({state}) => {
    const {sources, targets} = state
    return (
    <Row>
        <Col xs={5}>
            <TransitionList transitions={sources} className="btn btn-sm btn-outline-secondary" />
        </Col>
        <Col xs={2}><span>{state?.name}</span></Col>
        <Col xs={5}>
            <TransitionList transitions={targets} className="btn btn-sm btn-outline-secondary" />
        </Col>
    </Row>
    )
}