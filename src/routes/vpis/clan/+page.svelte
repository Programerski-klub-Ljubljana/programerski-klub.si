<script>
    import {Button, Col, Form, FormGroup, Input, Row} from "sveltestrap";
</script>

<Form>
    <Row>
        <div>
            <p>
                Preden podpišeš moraš vedeti da je mesečna članarina 40eu katera je namenjena izklučno
                delovanju kluba in v ceni se:
            </p>
            <ul>
                <li>Izplača honorar trenerjem za njihovo delo.</li>
                <li>Najemnina prostorov v osnovnih, srednjih šolah kjer imamo treninge programiranja.</li>
                <li>Razvoj javnih projektov ki so namenjeni izobraževanju članov in širše javnosti.</li>
            </ul>
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
                <Col>
                    <FormGroup>
                        <Input placeholder="Vnesi kontaktno številko..."/>
                    </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                    <FormGroup>
                        <Input type="checkbox" label="Kot član bom redno plačeval članarino." />
                    </FormGroup>
                </Col>
                <Col>
                    <FormGroup>
                        <Input type="checkbox" label="Kot član se bom držal pogojev poslovanja kluba." />
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
