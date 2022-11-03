<script>
    export let user = false;
    export let name = false;
</script>

<div class="col col-6 xs-5 sm-4 md-3 lg-2">
    <a class="clan-btn paper-btn" href="/clani/{user}#content">
        <img alt="Sprednji profil osebe {name}" src="/clani/{user}.png">
        <p>{name}</p>
    </a>
</div>
<style>
    .clan-btn p {
        text-align: center;
        margin: 10px 0;
    }

    .clan-btn {
        padding: 0;
    }
</style>
