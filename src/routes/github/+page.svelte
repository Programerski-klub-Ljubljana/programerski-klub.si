<script>
    export let data;
</script>


<p>
    Github je spletna stran namenjen za kolaboracijo programerjev
    in organizacij ki se ukvarjajo z programiranjem.
    Klub je logično zelo aktiven na Github-u kjer objavlja svoje projekte za učenje
    in projekte ki jih ustvarjajo člani kluba.
</p>

<p>
    Vsak član ki je opravil srednjo šolo je pri včlanitvi v klub avtomatsko dodan v github
    profil kluba, kjer lahko kolaborira v github skupini katero nadzira trener kluba.
</p>

<div class="row flex-spaces">
    <a class="paper-btn" href="{data.org.html_url}">
        <div class="col-12">

            <div class="row flex-spaces">
                <div class="xs-5 sm-3 col">
                    <img class="no-border" src="{data.org.avatar_url}">
                </div>
                <div class="xs-9 sm-9 col">
                    <h3>{data.org.login}</h3>
                    <h4>{data.org.bio}</h4>
                    <p>Število projektov: {data.org.public_repos}</p>
                    <p>Ustvarjen: {new Date(data.org.created_at).toLocaleDateString("sl-SI")}</p>
                </div>
            </div>
        </div>
    </a>
</div>

<div class="row flex-spaces">
    {#each data.repos as repo}
        <div class="xs-12 sm-6 align-middle">
            <a class="paper-btn" href="{repo.html_url}">
                <h4>{repo.name}</h4>
                <b>{repo.description}</b>
                <p>Programski jezik: {repo.language || 'brez'}</p>
                <p>Ustvarjen: {new Date(repo.created_at).toLocaleDateString("sl-SI")}</p>
            </a>
        </div>
    {/each}
</div>

<style>
    img {
        width: 100%;
    }
    h3, h4 {
        margin: 0;
        font-weight: bold;
    }
    h4 {
        margin-bottom: 10px;
    }
    .paper-btn {
        padding: 10px 10px 0 10px;
        margin: 5px 5px 5px 5px;
    }
</style>
