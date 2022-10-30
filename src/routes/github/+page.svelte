<script>
    import {Col, Container, Icon, Image, ListGroup, ListGroupItem, Row} from "sveltestrap";
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

<hr>

<Container>
    <Row>
        <Col sm="3">
            <Image fluid alt="Landscape" src="{data.org.avatar_url}"></Image>
        </Col>
        <Col>
            <p><a href="{data.org.html_url}">{data.org.login}</a></p>
            <p><b>{data.org.bio}</b></p>
            <p>Število projektov: {data.org.public_repos}</p>
            <p>Ustvarjen: {new Date(data.org.created_at).toLocaleDateString("sl-SI")}</p>
        </Col>
    </Row>

</Container>

{#each data.repos as repo}
    <hr>
    <p><a href="{repo.html_url}"><h5>{repo.name}</h5></a></p>
    <p>{repo.description}</p>
    <p>Programski jezik: {repo.language || 'brez'}</p>
    <p>Ustvarjen: {new Date(repo.created_at).toLocaleDateString("sl-SI")}</p>
{/each}
