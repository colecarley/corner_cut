<script lang="ts">
    import Center from "$lib/components/center.svelte";
    import { cubeTypes, type cubeTypeId } from "$lib/lookups/cubeTypes";
    import { times } from "$lib/store/times";
    import { getScramble } from "$lib/utils/getScramble";
    import { getTimes } from "$lib/utils/getTimes";
    import { saveTime } from "$lib/utils/saveTime";
    import { Button, Label, Select } from "flowbite-svelte";
    import { onDestroy, onMount } from "svelte";
    import themeList from "../../themes/_list";

    const DEFAULT_COLOR_INDEX = 116;

    let selectedColor = themeList[DEFAULT_COLOR_INDEX];
    function updateColors() {
        const stylesheets = document.querySelectorAll("link[rel=stylesheet]");

        for (const sheet of stylesheets) {
            sheet.parentElement?.removeChild(sheet);
        }

        const link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute(
            "href",
            `/Users/colecarley/src/corner_cut/frontend/src/themes/${selectedColor.name}.css`,
        );

        document.head.appendChild(link);
    }

    let scramble: string;
    let scrambleType: cubeTypeId = "333";
    onMount(() => {
        scramble = getScramble(scrambleType);
        getTimes();
    });

    let pastTimes: number[];
    let unsubscribe = times.subscribe((t) => {
        pastTimes = t;
    });

    onDestroy(unsubscribe);

    function updateScramble() {
        scramble = getScramble(scrambleType);
    }

    let time = 0;
    let interval: number;
    let start = 0;
    function startTimer() {
        start = Date.now();
        time = 0;
        interval = setInterval(() => {
            const datetime = new Date(Date.now() - start);
            time = datetime.getSeconds();
        }, 1000);
    }

    function endTimer() {
        clearInterval(interval);
        const datetime = new Date(Date.now() - start);
        time = parseFloat(
            `${datetime.getSeconds()}.${datetime.getMilliseconds()}`,
        );
        saveTime(time);
        scramble = getScramble(scrambleType);
    }

    let isRunning = false;
    let lastKeyTime: number;
    function handleKeydown(key: KeyboardEvent) {
        if (isRunning) {
            endTimer();
            lastKeyTime = key.timeStamp;
            isRunning = false;
        }
    }

    function handleKeyup(key: KeyboardEvent) {
        if (!isRunning) {
            // TODO implement this as a stack instead
            if (key.timeStamp - 100 < lastKeyTime) {
                return;
            }
            if (key.code == "Space") {
                startTimer();
                isRunning = true;
            }
        }
    }
</script>

<svelte:window
    on:keydown={(key) => handleKeydown(key)}
    on:keyup={(key) => handleKeyup(key)}
/>

{#if !isRunning}
    <div class="p-8">
        <p class="bg-bg">bg</p>
        <p class="bg-main">main</p>
        <p class="bg-caret">caret</p>
        <p class="bg-sub">sub</p>
        <p class="bg-sub-alt">sub alt</p>
        <p class="bg-text">text</p>
        <p class="bg-error">error</p>
        <p class="bg-error-extra">error extra</p>
        <p class="bg-colorful-error-extra">colorful error extra</p>
        <p class="bg-color-error-extra-color">color error extra color</p>

        <div class="flex gap-6">
            <Label>
                <p class="text-text">Scramble Type</p>
                <Select
                    bind:value={scrambleType}
                    items={cubeTypes.map((c) => ({ ...c, value: c.id }))}
                    on:change={() => updateScramble()}
                />
            </Label>
            <Label>
                <p class="text-text">Theme</p>

                <Select
                    bind:value={selectedColor}
                    items={themeList.map((color) => ({
                        name: color.name,
                        value: color,
                    }))}
                    on:change={() => updateColors()}
                ></Select>
            </Label>
        </div>
    </div>
    <div class="flex flex-col items-center bg-bg text-text">
        <h1 class="text-[50px] p-4 rounded-2xl outline outline-4 outline-main">
            {scramble}
        </h1>
        <Button class="text-sub" on:click={() => updateScramble()}
            >New Scramble</Button
        >
        {#if time}
            <p>{time}</p>
        {/if}
    </div>
    {#each pastTimes.reverse() as time}
        <div>
            <p>
                {time}
            </p>
        </div>
    {/each}
{:else}
    <div class="flex h-full justify-center items-center">
        <Center>
            <h1 class="text-text text-[288px]">{time}</h1>
        </Center>
    </div>
{/if}
