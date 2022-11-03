<script lang="ts" context="module">
	import {BoxBufferGeometry, MeshStandardMaterial} from "three";

	const geometry = new BoxBufferGeometry(1, 1, 1)
	const material = new MeshStandardMaterial({color: 'olive'})
</script>

<script lang="ts">
	import { Mesh, type Position, type Rotation } from '@threlte/core'
	import { Collider, RigidBody } from '@threlte/rapier'

	export let position: Position | undefined = undefined
	export let rotation: Rotation | undefined = undefined

</script>

<RigidBody type={'dynamic'} {position} {rotation}>
	<Collider
		contactForceEventThreshold={30}
		restitution={0.4}
		shape={'cuboid'}
		args={[0.5, 0.5, 0.5]}
	/>
	<Mesh castShadow receiveShadow {geometry} {material} />
</RigidBody>
