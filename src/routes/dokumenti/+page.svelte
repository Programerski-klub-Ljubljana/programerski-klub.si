<script>
    let loading = true;

    function frameLoaded(ev) {
        loading = false;
    }
</script>

<p>
    V zagotavljanju transparentnega delovanja kluba imamo vse dokumente javno dostopne vsem
    ki si jih želijo pogledati. V primeru če kakšen dokument manjka Vas naprošamo da nas kontaktirate
    in da nas opozorite na manjkajoče dokumente. Manjkajoče dokumente bomo dodali kar se da hitro.
</p>

<p>
    V naslednjem odseku se nahajajo vsi dokumenti ki so bili uporabljeni pri ustanovitvi kluba.
    Najpomembnejši dokument je temeljni akt društva kjer so napisani vsi členi ki opisujejo društvo in njegovo delovanje.
</p>
<br>

<div class="row flex-spaces">
{#if loading}
    <div class="col-2">
        <img class="no-border" src="https://thumbs.gfycat.com/AjarDisguisedAfricanparadiseflycatcher-max-1mb.gif"/>
        <div style="height: 5000px"></div>
    </div>
{/if}

    <div class="col-12">
        <iframe on:load="{frameLoaded}" class="embed-responsive-item" allowfullscreen
                src="https://drive.google.com/embeddedfolderview?id=1oKZzrawX_JM1Vj7efFtSWUQsQ6Tfo-Er#list">
        </iframe>
    </div>
</div>

<style>
    iframe {
        width: 100%;
        height: 380px;
        border: none;
    }
</style>
