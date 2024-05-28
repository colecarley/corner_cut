<script lang="ts">
    import Squeeze from "$lib/components/squeeze.svelte";
    import Center from "$lib/components/center.svelte";
    import { onDestroy, onMount } from "svelte";
    import { saveTime } from "$lib/utils/saveTime";
    import { times } from "$lib/store/times";
    import { getTimes } from "$lib/utils/getTimes";

    let scramble: string;
    onMount(() => {
        scramble = generateScramble();
        getTimes();
    });

    let pastTimes: number[];
    let unsubscribe = times.subscribe((t) => {
        pastTimes = t;
    });

    onDestroy(unsubscribe);

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
        scramble = generateScramble();
    }

    function generateScramble() {
        const scramble = [];
        while (scramble.length < 20) {
            const move = getRandomMove();
            if (canAddMove(scramble, move)) {
                scramble.push(move);
                continue;
            }
        }
        return scramble
            .map((move) => `${move}${getRandomVariation()}`)
            .join(" ");
    }
    const badLastForRepeatingPenultimate: Record<string, string> = {
        L: "R",
        R: "L",
        U: "D",
        D: "U",
        F: "B",
        B: "F",
    };
    function canAddMove(scramble: string[], move: string) {
        if (scramble.length == 0) {
            return true;
        }
        const lastMove = scramble[scramble.length - 1];
        if (lastMove == move) {
            return false;
        }
        if (scramble.length == 1) {
            return true;
        }
        if (lastMove == badLastForRepeatingPenultimate[move]) {
            const penultimateMove = scramble[scramble.length - 2];
            if (penultimateMove == move) {
                return false;
            }
        }
        return true;
    }

    const moveTypes = ["L", "R", "U", "D", "B", "F"];
    function getRandomMove() {
        return moveTypes[Math.floor(Math.random() * moveTypes.length)];
    }

    const variations = ["", "'", "2"];
    function getRandomVariation() {
        return variations[Math.floor(Math.random() * variations.length)];
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
