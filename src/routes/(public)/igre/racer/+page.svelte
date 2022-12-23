<script>
    import {Canvas} from '@threlte/core';
    import {HTML} from '@threlte/extras';
    import {Debug, World} from '@threlte/rapier';
    import Scene from '../../../../games/racer/Scene.svelte';
</script>

<div class="row margin-top" id="gumbi">
    <a class="paper-btn yellow margin-right-small" href="/igre#content">Igre</a>
    <label class="paper-btn orange" for="modal-1">Navodila</label>
</div>
<input class="modal-state" id="modal-1" type="checkbox">
<div class="modal">
    <label class="modal-bg" for="modal-1"></label>
    <div class="modal-body">
        <label class="btn-close" for="modal-1">X</label>
        <h4 class="modal-title">Racer</h4>
        <p class="modal-text">Hitra testna igra ki testira delovanje WebGL tehnologije.<br>Uporabljaš WASD (pogon) tipke in Space (zavore).<br><br>Pripravil:
            Uroš Jarc</p>
    </div>
</div>

<div id="canvas">
    <Canvas>
        <World>
            <Debug depthTest={false} depthWrite={false}/>

            <Scene/>

            <HTML slot="fallback" transform>
            <p>
                It seems your browser<br/>
                doesn't support WASM.<br/>
                I'm sorry.
            </p>
            </HTML>
        </World>
    </Canvas>
</div>

<style>
    #canvas {
        height: 750px;
        margin: 10px 0;
    }
</style>
