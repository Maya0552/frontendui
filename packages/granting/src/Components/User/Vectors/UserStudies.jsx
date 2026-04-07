import { CardCapsule } from "@hrbolek/uoisfrontend-shared"
import { Col, Row } from "react-bootstrap"

export const UserStudies = ({user}) => {
    return (
        <>
        Studies {JSON.stringify(user, null, 4)}
        <CardCapsule title="Přijímací řízení">
            <Row>
                <Col>Stav</Col>
                <Col>Otevřeno</Col>
            </Row>
            <Row>
                <Col>Program</Col>
                <Col>Kybernetická bezpečnost (5 letý, inženýrský, český jazyk)</Col>
            </Row>
            <Row>
                <Col>Datum ukončení přihlášek</Col>
                <Col>31.3.2025</Col>
            </Row>
            <Row>
                <Col>Datum doložení maturitního vysvědčení</Col>
                <Col>30.6.2025</Col>
            </Row>
            <Row>
                <Col>Datum platby za přihlášku</Col>
                <Col>30.6.2025</Col>
            </Row>
        </CardCapsule>
        <CardCapsule title="Výsledky zkoušek v přijímacím řízení">
            <CardCapsule title="Tělocvik">
                <CardCapsule title="Sed-Leh">
                    <Row>
                        <Col>Minimální počet bodů</Col>
                        <Col>2</Col>
                    </Row>
                    <Row>
                        <Col>Maximální počet bodů</Col>
                        <Col>20</Col>
                    </Row>
                    <Row>
                        <Col>Výsledek počet bodů</Col>
                        <Col>15</Col>
                    </Row>
                    <Row>
                        <Col>Datum vykonání</Col>
                        <Col>25.4.2025</Col>
                    </Row>
                </CardCapsule>
                <CardCapsule title="12 minutový běh">
                    <Row>
                        <Col>Minimální počet bodů</Col>
                        <Col>2</Col>
                    </Row>
                    <Row>
                        <Col>Maximální počet bodů</Col>
                        <Col>20</Col>
                    </Row>
                    <Row>
                        <Col>Výsledek počet bodů</Col>
                        <Col>15</Col>
                    </Row>
                    <Row>
                        <Col>Datum vykonání</Col>
                        <Col>25.4.2025</Col>
                    </Row>
                </CardCapsule>
                <Row>
                    <Col>Minimální počet bodů</Col>
                    <Col>4</Col>
                </Row>
                <Row>
                    <Col>Maximální počet bodů</Col>
                    <Col>40</Col>
                </Row>
                <Row>
                    <Col>Dosažený počet bodů</Col>
                    <Col>30</Col>
                </Row>
            </CardCapsule>
            <CardCapsule title="Anglický jazyk">
                <CardCapsule title="Anglický jazyk">
                    <Row>
                        <Col>Minimální počet bodů</Col>
                        <Col>2</Col>
                    </Row>
                    <Row>
                        <Col>Maximální počet bodů</Col>
                        <Col>20</Col>
                    </Row>
                    <Row>
                        <Col>Výsledek počet bodů</Col>
                        <Col>15</Col>
                    </Row>
                    <Row>
                        <Col>Datum vykonání</Col>
                        <Col>25.4.2025</Col>
                    </Row>             
                </CardCapsule>
                <Row>
                    <Col>Minimální počet bodů</Col>
                    <Col>2</Col>
                </Row>
                <Row>
                    <Col>Maximální počet bodů</Col>
                    <Col>20</Col>
                </Row>
                <Row>
                    <Col>Dosažený počet bodů</Col>
                    <Col>15</Col>
                </Row>
            </CardCapsule>
        </CardCapsule>
        </>
    )
}