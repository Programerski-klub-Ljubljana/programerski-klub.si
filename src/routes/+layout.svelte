<script>
    import 'bootstrap/dist/css/bootstrap.css';
    import 'bootstrap-icons/font/bootstrap-icons.css';
    import {Container} from "sveltestrap";
</script>


<Container>
    <h1 id="naslov">Programerski klub Ljubljana</h1>
    <h2>Združuje ljudi vseh starosti, ki si želijo ali pa že znajo programirati v skupine ki jih vodijo izkušeni trenerji.</h2>
    <h3>Hodimo na tekme, ustvarjamo igrice, sodelujemo v skupnih projektih, predvsem se pa zelo zabavamo. :)</h3>

    <a href="/">Domov</a>
    <slot></slot>
</Container>

<style>
    * {
        text-align: center;
    }
</style>
