import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

export const AdmissionMediumContent = ({admission}) => {
    return (
        <>
            <Row>
                <Col></Col>
                <Col>
                    {admission?.enddate}
                </Col>
            </Row>
        </>
    )
}