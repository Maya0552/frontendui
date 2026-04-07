import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { InsertRequestButton } from "../Request/InsertRequestButton"

export const RequestTypeMediumContent = ({requesttype, children}) => {
    const onAdd = (request) => {
        console.log("vztvo5en po6adavek", request)
        window.open(`/requests/request/view/${request.id}`, '_blank'); // Opens in a new tab
    }

    return (<>
        <Row>
            <Col>Typ požadavku</Col>
            <Col>{requesttype?.name}</Col>
            
        </Row>
        <Row>
            <Col>
                <InsertRequestButton 
                    onAdd={onAdd} 
                    request={{
                        request_type_id: requesttype.id,
                        name: "Žádost " + requesttype.name,
                        name_en: "Request " + (requesttype.nameEn || requesttype.name)
                    }}
                >
                    Vytvořit požadavek
                </InsertRequestButton>
            </Col>
        </Row>
        {children}
    </>)
}