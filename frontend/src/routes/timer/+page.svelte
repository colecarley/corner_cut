<script lang="ts">
    import Center from "$lib/components/center.svelte";
    import { cubeTypes, type cubeTypeId } from "$lib/lookups/cubeTypes";
    import { times } from "$lib/store/times";
    import { getScramble } from "$lib/utils/getScramble";
    import { getTimes } from "$lib/utils/getTimes";
    import { saveTime } from "$lib/utils/saveTime";
    import { Label, Select } from "flowbite-svelte";
    import { onDestroy, onMount } from "svelte";

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
        <Label>
            <p class="text-[color:var(--cc-green)]">Scramble Type</p>
            <Select
                bind:value={scrambleType}
                items={cubeTypes.map((c) => ({ ...c, value: c.id }))}
                on:change={() => updateScramble()}
            />
        </Label>
    </div>
    <div
        class="flex flex-col items-center bg-[color:var(--cc-black)] text-[color:var(--cc-green)]"
    >
        <h1 class="text-[50px]">{scramble}</h1>
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
            <h1 class="text-[color:var(--cc-green)] text-[288px]">{time}</h1>
        </Center>
    </div>
{/if}
