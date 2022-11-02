<script>
    export let user = false;
    export let name = false;
    export let desc = false;
    export let web = false;
    export let github = false;
    export let tel = '';
    let link = web.replace("https://", "");
</script>

<div class="row flex-spaces">
    <div class="col-8 xs-5 sm-4 md-3 lg-3 col">
        <img class="shadow" src="/clani/{user}.png">
    </div>
    <div class="sm-align-center col-12 xs-8 sm-8 md-9 lg-9">
        <h2 class="vizitka-title">{name}</h2>
        <h3 class="vizitka-desc">{desc}</h3>
        <p class="vizitka-links">
            <a href="tel:{tel}">{tel}</a>
            <a href="{web}">{web}</a>
            <a href="https://github.com/{github}">Git: {github}</a>
        </p>
    </div>
</div>

<style>
    .vizitka-title, .vizitka-desc, .vizitka-links {
        margin: 0 10px 10px 0;
    }
    .vizitka-desc {
        font-size: 30px;
        margin-bottom: 20px
    }
    .vizitka-links a {
        margin-right: 10px;
        font-size: 20px;
    }
</style>
