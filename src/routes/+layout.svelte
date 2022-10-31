<script>
    import 'papercss/dist/paper.min.css'
</script>

<div id="head" class="row">
    <div class="col-2 col"></div>
    <div class="col-8 col border shadow">
        <h1 id="naslov">Programerski klub Ljubljana</h1>
        <h2>Združuje ljudi vseh starosti, ki si želijo ali pa že znajo programirati v skupine ki jih vodijo izkušeni trenerji.</h2>
        <h3>Hodimo na tekme, ustvarjamo igrice, sodelujemo v skupnih projektih, predvsem se pa zelo zabavamo. :)</h3>
        <a class="paper-btn" href="/">Nazaj</a>
    </div>
    <div class="col-2 col"></div>
</div>

<div class="row">
    <div class="col-2 col"></div>
    <div class="col-8 col border shadow">
        <slot></slot>
    </div>
    <div class="col-2 col"></div>
</div>

<style>
    #head{
        margin-top: 20px;
    }
    h1, h2, h3 {
        text-align: center;
    }
   h2 {
       font-size: 40px;
   }
   h3 {
       font-size: 30px;
   }
</style>
