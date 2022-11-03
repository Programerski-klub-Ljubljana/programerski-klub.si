<script lang="ts">
	import { useFrame } from '@threlte/core'
	import { Euler } from 'three'
	import { Vector3 } from 'three'
	import Particle from './Particle.svelte'

	const getId = () => {
		return Math.random().toString(16).slice(2)
	}

	const getRandomPosition = () => {
		return new Vector3(20 - Math.random() * 40, 7 , -7)
	}

	const getRandomRotation = () => {
		return new Euler(Math.random() * 10, Math.random() * 10, Math.random() * 10)
	}

	type Body = {
		id: string
		mounted: number
		position: Vector3
		rotation: Euler
	}

	let bodies: Body[] = []

	let lastBodyMounted: number = 0
	let bodyEveryMilliseconds = 2000
	let longevityMilliseconds = 15000

	useFrame(() => {
		if (lastBodyMounted + bodyEveryMilliseconds < Date.now()) {
			const body: Body = {
				id: getId(),
				mounted: Date.now(),
				position: getRandomPosition(),
				rotation: getRandomRotation()
			}
			bodies.unshift(body)
			lastBodyMounted = Date.now()
			bodies = bodies
		}
		const deleteIds: string[] = []
		bodies.forEach((body) => {
			if (body.mounted + longevityMilliseconds < Date.now()) {
				deleteIds.push(body.id)
			}
		})

		if (deleteIds.length) {
			deleteIds.forEach((id) => {
				const index = bodies.findIndex((body) => body.id === id)
				if (index !== -1) bodies.splice(index, 1)
			})
			bodies = bodies
		}
	})
</script>

{#each bodies as body (body.id)}
	<Particle position={body.position} rotation={body.rotation} />
{/each}
