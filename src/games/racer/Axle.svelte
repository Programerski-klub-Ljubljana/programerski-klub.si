<script>
    import {Group} from '@threlte/core';
    import {Collider, RigidBody, useFixedJoint, useRevoluteJoint} from '@threlte/rapier';
    import {spring} from 'svelte/motion';
    import {clamp, DEG2RAD, mapLinear} from 'three/src/math/MathUtils';
    import {useCar} from './Car.svelte';
    import {useWasd} from './useWasd.ts';
    import Wheel from './Wheel.svelte';

    export let position = undefined;
    export let parentRigidBody = undefined;
    export let anchor;
    export let isSteered = false;
    export let isDriven = false;
    export let side;
    let axleRigidBody;
    const wasd = useWasd();
    const {speed} = useCar();
    const steeringAngle = spring(mapLinear(clamp($speed / 12, 0, 1), 0, 1, 1, 0.5) * $wasd.x * 15);
    $: steeringAngle.set(mapLinear(clamp($speed / 12, 0, 1), 0, 1, 1, 0.5) * $wasd.x * 15);
    const {joint, rigidBodyA, rigidBodyB} = isSteered
        ? useRevoluteJoint(anchor, {}, {y: 1})
        : useFixedJoint(anchor, {}, {}, {});
    $: if (parentRigidBody)
        rigidBodyA.set(parentRigidBody);
    $: if (axleRigidBody)
        rigidBodyB.set(axleRigidBody);
    $: $joint?.setContactsEnabled(false);
    $: if (isSteered) {

        $joint?.configureMotorPosition($steeringAngle * -1 * DEG2RAD, 1000000, 0);
    }
</script>

<Group {position}>
    <RigidBody bind:rigidBody={axleRigidBody}>
        <Collider args={[0.03, 0.03, 0.03]} mass={1} shape={'cuboid'}/>
    </RigidBody>

    <Wheel
            anchor={{ z: side === 'left' ? 0.2 : -0.2 }}
            {isDriven}
            parentRigidBody={axleRigidBody}
            position={{ z: side === 'left' ? 0.2 : -0.2 }}
    />
</Group>
