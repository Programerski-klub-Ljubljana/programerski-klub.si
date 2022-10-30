<script>
    import {Button, Col, Form, FormGroup, Input, Row} from "sveltestrap";
</script>

<p>
    Hvala ker ste se odločili vspostaviti kontakt z nami. Na vsak email odgovorimo kar se da hitro.
    V primeru dela lahko pričakujete odgovor najkasneje do večera istega dne na katerega ste poslali sporočilo...
</p>
<Form>
    <Row>
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
                        <Input placeholder="Vnesi email..."/>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Input type="textarea" rows=9 placeholder="Sporočilo..."/>
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
