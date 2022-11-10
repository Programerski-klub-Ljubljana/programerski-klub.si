<script>
    import {DirectionalLight, Mesh, Object3DInstance, PerspectiveCamera} from '@threlte/core';
    import {useGltf} from '@threlte/extras';
    import {AutoColliders, RigidBody} from '@threlte/rapier';
    import {BoxGeometry, MeshStandardMaterial} from 'three';
    import {DEG2RAD} from 'three/src/math/MathUtils';
    import Car from './Car.svelte';
    import Ground from './Ground.svelte';

    const {gltf} = useGltf('/models/loop/loop.glb');
</script>

<DirectionalLight position={{ y: 20, x: 8, z: -3 }}/>

<Ground/>

<RigidBody dominance={1} position={{ y: 3, x: -10, z: -12 }}>
    <AutoColliders shape={'cuboid'}>
        <Mesh geometry={new BoxGeometry(1, 1, 1)} material={new MeshStandardMaterial({wireframe: false})}/>
    </AutoColliders>
</RigidBody>

<RigidBody dominance={-1} position={{ y: 3, x: -15, z: -14 }}>
    <AutoColliders shape={'cuboid'}>
        <Mesh geometry={new BoxGeometry(3, 3, 3)} material={new MeshStandardMaterial({wireframe: false})}/>
    </AutoColliders>
</RigidBody>

<RigidBody dominance={0} position={{ y: 3, x: -13, z: -10 }}>
    <AutoColliders shape={'cuboid'}>
        <Mesh geometry={new BoxGeometry(2, 2, 2)} material={new MeshStandardMaterial({wireframe: false})}/>
    </AutoColliders>
</RigidBody>

{#if $gltf}
    <AutoColliders shape={'trimesh'}>
        <Object3DInstance
                rotation={{ y: 90 * DEG2RAD }}
                object={$gltf.scene}
                position={{ y: -0.3, x: -50, z: -3 }}
        />
    </AutoColliders>
{/if}

<Car position={{ y: 5, x: 70 }}>
    <PerspectiveCamera
            fov={60}
            position={{ y: 5, x: 10 }}
            rotation={{ x: -90 * DEG2RAD, z: 90 * DEG2RAD, y: 70 * DEG2RAD }}
    />
</Car>
