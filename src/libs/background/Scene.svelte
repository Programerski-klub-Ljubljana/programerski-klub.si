<script lang="ts">
    import {
        DirectionalLight,
        OrbitControls,
        PerspectiveCamera
    } from '@threlte/core'
    import Emitter from './Emitter.svelte'
    import Ground from './Ground.svelte'
</script>

<PerspectiveCamera position={{ y: 20, z: 10, x: 0 }}>
    <OrbitControls enableZoom={true}/>
</PerspectiveCamera>

<DirectionalLight shadow position={{ y: 20, x: 8, z: -3 }}/>


<Ground/>

<Emitter/>
