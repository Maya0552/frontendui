import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

export const UserMediumContent = ({user, children}) => {
    return (
        <>
        <Row>
            <Col>Jméno</Col>
            <Col>{user.name}</Col>
        </Row>
        <Row>
            <Col>Příjmení</Col>
            <Col>{user.surname}</Col>
        </Row>
        <Row>
            <Col>GDPR</Col>
            <Col>
                <button className='btn btn-sm btn-success'>click</button>
            </Col>
        </Row>
        <Row>
            <Col>
                Email
            </Col>
            <Col>
                <a href={"mailto:" + user?.email}>{user?.email}</a>
            </Col>
        </Row>
        <Row>
            <Col>
                Telefon
            </Col>
            <Col>
                <a href="tel:973211111">973 211 111</a>
            </Col>
        </Row>
        {children}
    </>
    )
}