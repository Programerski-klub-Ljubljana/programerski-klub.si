<script>
    import 'papercss/dist/paper.min.css'
</script>

<div id="head" class="row">
    <div class="xs-0 sm-2 col"></div>
    <div class="xs-12 sm-8 col border shadow">
        <h1 id="naslov">Programerski klub Ljubljana</h1>
        <h2>Združuje ljudi vseh starosti, ki si želijo ali pa že znajo programirati v skupine ki jih vodijo izkušeni trenerji.</h2>
        <h3>Hodimo na tekme, ustvarjamo igrice, sodelujemo v skupnih projektih, predvsem se pa zelo zabavamo. :)</h3>
        <a class="paper-btn" href="/#content">Nazaj</a>
    </div>
    <div class="xs-0 sm-2 col"></div>
</div>

<div class="row">
    <div class="xs-0 sm-2 col"></div>
    <div id="content" class="xs-12 sm-8  col border shadow">
        <slot></slot>
    </div>
    <div class="xs-0 sm-2 col-2 col"></div>
</div>

<style>
    #head .col{
        margin: 5px 5px 0 10px;
        padding: 0 10px 10px 10px !important;
    }
    h1 {
        font-size: 70px;
    }
    h1, h2, h3 {
        text-align: center;
        padding: 0;
        margin: 0;
        margin-bottom: 20px;
    }
   h2 {
       font-size: 40px;
   }
   h3 {
       font-size: 30px;
   }
</style>
