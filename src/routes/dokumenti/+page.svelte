<script>
    import {Progress, Spinner} from "sveltestrap";

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

{#if loading}
    <div class="d-flex justify-content-center">
        <Spinner flex size='xl'/>
    </div>
    <div style="height: 5000px"></div>
{/if}

<div class="ratio ratio-1x1">
    <iframe on:load="{frameLoaded}" class="embed-responsive-item" allowfullscreen
            src="https://drive.google.com/embeddedfolderview?id=1oKZzrawX_JM1Vj7efFtSWUQsQ6Tfo-Er#list">
    </iframe>
</div>
