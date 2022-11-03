<script lang="ts">
    import {Canvas} from '@threlte/core'
    import {HTML} from '@threlte/extras'
    import {World} from '@threlte/rapier'
    import Scene from './Scene.svelte'

</script>

<div id="background">
    <Canvas>
        <World>
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
	#background {
		position: absolute;
		top: 0;
		left: 0;
        height: 100vh;
        width: 100vw;
        z-index: -100;
	}
    p {
        font-size: 0.75rem;
        line-height: 1rem;
    }
</style>
