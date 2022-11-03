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
    <a class="paper-btn" href="{data.org.html_url}" target="_blank" rel="noreferrer" >
        <div class="col-12">

            <div class="org-row row flex-spaces">
                <div class="col-4 xs-4 sm-3 col">
                    <img alt="Logo kluba in github organizacije, oglato srce ki se smeji" class="org-img no-border" src="{data.org.avatar_url}">
                </div>
                <div class="sm-align-center xs-12 sm-9">
                    <h3 class="org-title">{data.org.login}</h3>
                    <h4 class="org-bio">{data.org.bio}</h4>
                    <p>Število projektov: {data.org.public_repos}</p>
                    <p class="org-created">Ustvarjen: {new Date(data.org.created_at).toLocaleDateString("sl-SI")}</p>
                </div>
            </div>
        </div>
    </a>
</div>

<div class="row flex-spaces">
    {#each data.repos as repo}
        <div class="repo-row sm-12 md-6 col">
            <a target="_blank" rel="noreferrer" class="paper-btn" href="{repo.html_url}">
                <h4 class="repo-name">{repo.name}</h4>
                <b>{repo.description}</b>
                <p>Programski jezik: {repo.language || 'brez'}</p>
                <p class="repo-created">Ustvarjen: {new Date(repo.created_at).toLocaleDateString("sl-SI")}</p>
            </a>
        </div>
    {/each}
</div>

<style>
    .org-row {
        margin-bottom: 0;
    }

    .org-img {
        width: 100%;
    }

    .org-title, .org-bio, .repo-name {
        margin: 0;
        font-weight: bold;
    }

    .repo-name {
        margin-bottom: 5px;
    }

    .repo-created, .org-created {
        margin-bottom: 0;
    }
</style>
