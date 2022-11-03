<script>
    import {Canvas} from '@threlte/core';
    import {HTML} from '@threlte/extras';
    import {Debug, World} from '@threlte/rapier';
    import Scene from '../../libs/racer/Scene.svelte';
</script>

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
        margin-top: 300px;
        height: 800px;
    }
</style>
