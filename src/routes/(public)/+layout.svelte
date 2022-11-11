<script lang="ts">
    import 'papercss/dist/paper.min.css'
    import Background from "../../games/background/Background.svelte";


</script>

<Background/>

<div class="row flex-spaces" id="glava">
    <div class="xs-11 sm-10 md-10 lg-8 col border shadow shadow-small" id="mozgani">
        <h1 id="naslov">
            <a href="/admin">Programerski klub Ljubljana</a>
        </h1>
        <h2 id="podnaslov">Združuje ljudi vseh starosti, ki si želijo ali pa že znajo programirati v skupine ki jih
            vodijo naši trenerji.</h2>
        <h3 id="podpodnaslov">Hodimo na tekme, ustvarjamo igrice, sodelujemo v skupnih
            projektih,

            <a class="green paper-btn" href="/static#content" id="nazaj">Nazaj</a>
            predvsem se pa zelo zabavamo. :)</h3>
    </div>
</div>

<div class="row flex-spaces">
    <div class="xs-11 sm-10 md-10 lg-8 col border shadow shadow-small" id="content">
        <slot></slot>
    </div>
</div>


<style global>
    /* COLORS */
    .green {
        background-color: #afe179;
    }

    .purple {
        background-color: #c4abf8;
    }

    .red {
        background-color: palevioletred;
    }

    .blue {
        background-color: #dbebff;
    }

    .yellow {
        background-color: #f5d527;
    }

    .orange {
        background-color: #e8a949;
    }

    /* INPUTS, OUTPUTS =============================== */
    input, textarea {
        resize: none;
        width: 100%;
    }


    /* CUSTOM ALIGN ================================== */
    .sm-align-center {
        text-align: center;
    }

    @media (min-width: 768px) {
        .sm-align-center {
            text-align: left;
        }
    }

    /* IFRAME LOADER ================================= */
    .iframe-loader {
        background: url('data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 100% 100%"><text fill="%23FF0000" x="50%" y="50%" font-family="\'Lucida Grande\', sans-serif" font-size="24" text-anchor="middle">Loading...</text></svg>') 0 0 no-repeat;
    }

    iframe {
        border: none;
        width: 100%;
        height: 100%;
    }

    .iframe-loader {
        width: 100%;
        margin: 5px 0 20px 20px;
        height: 300px;
    }

    /* THIS PAGE ======================================================== */
    body {
        background-color: olivedrab;
    }

    #mozgani, #content {
        max-width: 1000px;
        background-color: white;
    }

    #mozgani {
        padding: 10px 10px 5px;
    }

    #glava, #content {
        margin: -15px 2px 0 2px;
        padding: 0;
    }

    #content {
        padding: 0 20px 0 15px;
        margin-top: 30px;
    }

    #naslov, #podnaslov, #podpodnaslov {
        text-align: center;
        margin: 0;
        padding: 5px;
    }

    #naslov {
        font-size: 50px;
        font-weight: bold;
    }

    #podnaslov {
        font-size: 30px;
        font-weight: bold;
    }

    #podpodnaslov {
        font-size: 25px;
    }

    #nazaj {
        float: left;
        margin: 10px 5px 2px 0;
    }


</style>
