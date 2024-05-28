<script>
    export let squares;
</script>

<div class="grid grid-cols-3">
    {#each squares as square}
        <div class="h-4 aspect-square outline"></div>
    {/each}
</div>
