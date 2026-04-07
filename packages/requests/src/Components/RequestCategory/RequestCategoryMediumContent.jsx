import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

export const RequestCategoryMediumContent = ({requestcategory, children}) => <>
    <Row>
        <Col></Col>
        <Col>{requestcategory?.name}</Col>
    </Row>
    {children}
</>