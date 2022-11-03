<script>
    import {Mesh, Object3DInstance} from '@threlte/core';
    import {AutoColliders} from '@threlte/rapier';
    import {BoxBufferGeometry, GridHelper, MeshStandardMaterial} from 'three';
</script>

<Object3DInstance object={new GridHelper(150, 15)} position={{ y: 0.001 }}/>

<AutoColliders position={{ y: -0.5 }} shape={'cuboid'}>
    <Mesh
            geometry={new BoxBufferGeometry(150, 1, 150)}
            material={new MeshStandardMaterial()}
            receiveShadow
    />
</AutoColliders>
