<script lang="ts">
    import {Mesh} from '@threlte/core'
    import {AutoColliders} from '@threlte/rapier'
    import {BoxBufferGeometry, MeshStandardMaterial} from 'three'
</script>

<AutoColliders shape={'cuboid'} rotation={{x:0.5}} position={{ y: -0.5 }}>
    <Mesh
            geometry={new BoxBufferGeometry(40, 1, 40)}

            material={new MeshStandardMaterial({
			color: '#22380a',
		})}
    />
</AutoColliders>
