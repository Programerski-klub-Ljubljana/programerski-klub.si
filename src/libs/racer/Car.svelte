<script  context="module">
    import { writable } from 'svelte/store';
    export const useCar = () => {
        return getContext('threlte-car-context');
    };
</script>

<script>
    import { Group, Mesh, useFrame } from '@threlte/core';
    import { Collider, RigidBody, useRapier } from '@threlte/rapier';
    import { getContext, onDestroy, setContext } from 'svelte';
    import { BoxBufferGeometry, MeshStandardMaterial, Vector3 } from 'three';
    import Axle from './Axle.svelte';
    export let position = undefined;
    export let rotation = undefined;
    let parentRigidBody;
    const carContext = {
        speed: writable(0)
    };
    const { speed } = carContext;
    setContext('threlte-car-context', carContext);
    const { world } = useRapier();
    const v3 = new Vector3();
    useFrame(() => {
        const s = parentRigidBody.linvel();
        v3.set(s.x, s.y, s.z);
        carContext.speed.set(v3.length());
    });
    const initialIterations = {
        maxStabilizationIterations: world.maxStabilizationIterations,
        maxVelocityFrictionIterations: world.maxVelocityFrictionIterations,
        maxVelocityIterations: world.maxVelocityIterations
    };
    world.maxStabilizationIterations *= 100;
    world.maxVelocityFrictionIterations *= 100;
    world.maxVelocityIterations *= 100;
    onDestroy(() => {
        world.maxStabilizationIterations = initialIterations.maxStabilizationIterations;
        world.maxVelocityFrictionIterations = initialIterations.maxVelocityFrictionIterations;
        world.maxVelocityIterations = initialIterations.maxVelocityIterations;
    });
</script>

<Group {position} {rotation}>
    <RigidBody bind:rigidBody={parentRigidBody} canSleep={false}>
        <Collider mass={0.8} shape={'cuboid'} args={[1.25, 0.4, 0.5]} />

        <!-- CAR BODY MESH -->
        <Mesh
                castShadow
                geometry={new BoxBufferGeometry(2.5, 0.8, 1)}
                material={new MeshStandardMaterial()}
        />

        <slot />
    </RigidBody>

    <!-- FRONT AXLES -->
    <Axle
            side={'left'}
            isSteered
            {parentRigidBody}
            position={{ x: -1.2, z: 0.8, y: -0.4 }}
            anchor={{ x: -1.2, z: 0.8, y: -0.4 }}
    />
    <Axle
            side={'right'}
            isSteered
            {parentRigidBody}
            position={{ x: -1.2, z: -0.8, y: -0.4 }}
            anchor={{ x: -1.2, z: -0.8, y: -0.4 }}
    />

    <!-- BACK AXLES -->
    <Axle
            isDriven
            side={'left'}
            {parentRigidBody}
            position={{ x: 1.2, z: 0.8, y: -0.4 }}
            anchor={{ x: 1.2, z: 0.8, y: -0.4 }}
    />
    <Axle
            isDriven
            side={'right'}
            {parentRigidBody}
            position={{ x: 1.2, z: -0.8, y: -0.4 }}
            anchor={{ x: 1.2, z: -0.8, y: -0.4 }}
    />
</Group>
