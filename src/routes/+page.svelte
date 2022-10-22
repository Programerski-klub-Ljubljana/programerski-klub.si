<script>
    import {Card, Col, Container, Icon, Row} from "sveltestrap";
</script>

<Container>
    <h1 id="naslov">Programerski klub Ljubljana</h1>
    <h2>Združuje ljudi vseh starosti, ki si želijo ali pa že znajo programirati v skupine ki jih vodijo naši izkušeni trenerji.</h2>
    <h3>Hodimo na tekme, ustvarjamo igrice, sodelujemo v skupnih projektih, predvsem se pa zelo zabavamo. :)</h3>

    <Row>
        <Col>
            <Icon name="envelope"/>
            <a href="info@programerski-klub.si">info@programerski-klub.si</a>
        </Col>
        <Col>
            <Icon name="telephone"/>
            <a href="051-240-885">051-240-885</a>
        </Col>
    </Row>
    <Row>
        <Col>
            <Card body><a href="/vpis/clan">Postani član</a></Card>
        </Col>
        <Col>
            <Card body><a href="/vpis/trener">Postani trener</a></Card>
        </Col>
        <Col>
            <Card body><a href="/vpis/uprava">Postani član uprave</a></Card>
        </Col>
        <Col>
            <Card body><a href="/izpis">Izpiši se</a></Card>
        </Col>
    </Row>
    <Row>
        <Col>
            <Card body><a href="oddeleki/osnovnosolski">Osnovnošolski oddelek</a></Card>
        </Col>
        <Col>
            <Card body><a href="oddeleki/srednjesolski">Srednješolski oddelek</a></Card>
        </Col>
        <Col>
            <Card body><a href="oddeleki/clanski">Članski oddelek</a></Card>
        </Col>
        <Col>
            <Card body><a href="oddeleki/trenerski">Trenerski oddelek</a></Card>
        </Col>
        <Col>
            <Card body><a href="oddeleki/upravni">Upravni oddelek</a></Card>
        </Col>
    </Row>
    <Row>
        <Col>
            <Card body><a href="/igre">Igre</a></Card>
        </Col>
        <Col>
            <Card body><a href="/github">Github</a></Card>
        </Col>
        <Col>
            <Card body><a href="/dokumenti">Dokumenti</a></Card>
        </Col>
    </Row>
</Container>

<style>
    * {
        text-align: center;
        padding: 20px;
    }

</style>
