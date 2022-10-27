<script>
    import {Button, Col, Form, FormGroup, Input, Row} from "sveltestrap";
</script>

<Form>
    <Row>
        <div>
            <p>Hej! Škoda ker nas zapuščaš... Dan ne bo enak brez tebe :(</p>
            <p>Ful bi bilo cool če bi nam povedal
                zakaj zapuščaš klub da bi se lahko popravili in izboljšali!</p>

                <p>
                    Vsak komentar pogledamo na upravnem zboru kluba zato ne pišeš za brez veze. :)
                    Bodi fino in se še kaj vidimo!
                </p>
        </div>
        <Col>
            <Row>
                <Col>
                    <FormGroup>
                        <Input placeholder="Vnesi svoj ime..."/>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Input placeholder="Vnesi svoj priimek..."/>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Input type="number" placeholder="Dan rojstva..."/>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Input type="number" placeholder="Mesec rojstva..."/>
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Input type="number" placeholder="Leto rojstva..."/>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Input placeholder="Vnesi email..."/>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Input placeholder="Razlog odhoda iz kluba..."/>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button block>Poslji</Button>
                </Col>
            </Row>
        </Col>
    </Row>
</Form>
