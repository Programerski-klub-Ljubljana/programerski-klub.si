<script>
    import { MotorModel } from '@dimforge/rapier3d-compat';
    import { Mesh } from '@threlte/core';
    import { Collider, RigidBody, useRevoluteJoint } from '@threlte/rapier';
    import { CylinderBufferGeometry, MeshStandardMaterial } from 'three';
    import { DEG2RAD } from 'three/src/math/MathUtils';
    import { useWasd } from './useWasd.js';
    export let position = undefined;
    export let parentRigidBody = undefined;
    export let anchor;
    let collider;
    export let isDriven = false;
    const wasd = useWasd();
    let isSpaceDown = false;
    const { rigidBodyA, rigidBodyB, joint } = useRevoluteJoint(anchor, {}, { z: 1 });
    $: if (parentRigidBody)
        rigidBodyA.set(parentRigidBody);
    $: $joint?.configureMotorModel(MotorModel.AccelerationBased);
    $: $joint?.configureMotorModel(isDriven && isSpaceDown ? MotorModel.ForceBased : MotorModel.AccelerationBased);
    $: if (isDriven)
        $joint?.configureMotorVelocity(isSpaceDown ? 0 : $wasd.y * 1000, 10);
    $: $joint?.setContactsEnabled(false);
    const onKeyDown = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            isSpaceDown = true;
        }
    };
    const onKeyUp = (e) => {
        if (e.key === ' ') {
            e.preventDefault();
            isSpaceDown = false;
        }
    };
</script>

<svelte:window on:keydown={onKeyDown} on:keyup={onKeyUp} />

<RigidBody canSleep={false} {position} bind:rigidBody={$rigidBodyB}>
    <Collider
            mass={1}
            friction={1.5}
            shape={'cylinder'}
            args={[0.12, 0.3]}
            bind:collider
            rotation={{ x: 90 * DEG2RAD }}
    />

    <!-- WHEEL MESH -->
    <Mesh
            castShadow
            rotation={{ x: 90 * DEG2RAD }}
            geometry={new CylinderBufferGeometry(0.3, 0.3, 0.24)}
            material={new MeshStandardMaterial()}
    />
</RigidBody>
