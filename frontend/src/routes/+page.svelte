<script lang="ts">
    import { Select } from "flowbite-svelte";
    import themeList from "../themes/_list";
    function updateColors() {
        console.log(selectedColor);

        document.documentElement.style.setProperty(
            "--cc-black",
            selectedColor.bgColor,
        );
        document.documentElement.style.setProperty(
            "--cc-green",
            selectedColor.textColor,
        );
    }

    let selectedColor = themeList[0];
    async function getColors() {}
</script>

<h1>Welcome to SvelteKit</h1>
<p>
    Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation
</p>
<h1 class="text-3xl font-bold underline">Hello world!</h1>

<button on:click={() => getColors()}>get colors</button>

<Select
    bind:value={selectedColor}
    items={themeList.map((color) => ({
        name: color.name,
        value: color,
    }))}
    on:change={() => updateColors()}
></Select>
