<script>
    import 'bootstrap/dist/css/bootstrap.css';
    import 'bootstrap-icons/font/bootstrap-icons.css';
    import {Button, Col, Container, Icon, Row} from "sveltestrap";
</script>


<Container lg>
    <Row>
        <Col xs={{size: 6, offset: 3}}>
            <h1 id="naslov">Programerski klub Ljubljana</h1>
            <h6>Združuje ljudi vseh starosti, ki si želijo ali pa že znajo programirati v skupine ki jih vodijo izkušeni trenerji.</h6>
            <p><b>Hodimo na tekme, ustvarjamo igrice, sodelujemo v skupnih projektih, predvsem se pa zelo zabavamo. :)</b></p>

            <Button style="border-radius: 1000px" href="/"><Icon name="house"></Icon> Domov</Button>
            <hr>
            <slot></slot>
        </Col>
    </Row>
</Container>

<style>
    * {
        text-align: center;
    }
</style>
