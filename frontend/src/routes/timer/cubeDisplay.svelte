<script lang="ts">
    import CubeFace from "./cubeFace.svelte";

    export let cube: Cube;
</script>

<div>
    {#each cube.faces as face}
        <CubeFace sqaures={face} />
    {/each}
</div>
