<script lang="ts">
    import Center from "$lib/components/center.svelte";
    import { cubeTypes, type cubeTypeId } from "$lib/lookups/cubeTypes";
    import { twistyPlayerCubeTypesById } from "$lib/lookups/twistyPlayerCubeTypes";
    import { getScramble } from "$lib/utils/getScramble";
    import {
        createSession,
        createTime,
        getSessions,
        getTimes,
        removeTime,
        saveSession,
        saveTime,
        updateTime,
        type Session,
        type Time,
    } from "$lib/utils/getTimes";
    import { TwistyPlayer, type PuzzleID } from "cubing/twisty";
    import { Button, Label, Modal, Select } from "flowbite-svelte";
    import { onMount } from "svelte";
    import themeList from "../../themes/_list";
    import Summary from "$lib/components/summary.svelte";

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

    let showTimeModal = false;
    let selectedTime: Time;

    let scramble: string = "";
    let scrambleType: cubeTypeId = "333";
    let sessions: Session[] = [];
    let currentSession: string;
    let times: Time[] = [];
    onMount(() => {
        scramble = getScramble(scrambleType);
        sessions = getSessions();
        if (!sessions.length) {
            saveSession(createSession("Playground", "333"));
            sessions = getSessions();
        }
        currentSession = sessions[0]?.id;

        times = getTimes(currentSession);
        updateTwistyPlayer();
    });

    function updateTwistyPlayer() {
        const player = new TwistyPlayer({
            alg: scramble,
            visualization: "2D",
            controlPanel: "none",
            background: "none",
            colorScheme: "light",
            puzzle: twistyPlayerCubeTypesById[scrambleType]
                .playerId as PuzzleID,
        });
        const container = document.getElementById("twisty-player");
        if (container) {
            container.innerHTML = "";
            container.appendChild(player);
        }
    }

    function changeSession() {
        times = getTimes(currentSession);
        updateTwistyPlayer();
    }

    function updateScramble() {
        scramble = getScramble(scrambleType);
        updateTwistyPlayer();
    }

    function handleDeleteTime() {
        removeTime(currentSession, selectedTime.id);
        times = getTimes(currentSession);
    }

    function handleDNF() {
        updateTime(currentSession, selectedTime.id, { isDNF: true });
        times = getTimes(currentSession);
        console.log(times);
    }

    let time = 0;
    let interval: number;
    let start = 0;
    let state: "idle" | "not ready" | "ready" | "running" = "idle";
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

        saveTime(currentSession, createTime(time, scramble, false));
        times = getTimes(currentSession);
        scramble = getScramble(scrambleType);
    }

    let isRunning = false;
    let lastKeyTime: number;
    let timeStamp = 0;
    function handleKeydown(key: KeyboardEvent) {
        if (key.code == "Space") {
            if (state === "idle") {
                state = "not ready";
                document.body.style.backgroundColor = "var(--error-color)";
                timeStamp = key.timeStamp;
            }
            if (state == "not ready" && key.timeStamp - timeStamp >= 550) {
                state = "ready";
                document.body.style.backgroundColor = "var(--caret-color)";
            }
            if (state === "running") {
                document.body.style.backgroundColor = "var(--bg-color)";
                endTimer();
                lastKeyTime = key.timeStamp;
                isRunning = false;
                state = "idle";
            }
        }
    }

    function handleKeyup(key: KeyboardEvent) {
        if (state === "ready" && key.timeStamp - timeStamp >= 550) {
            if (key.code == "Space") {
                state = "running";
                document.body.style.backgroundColor = "var(--bg-color)";
                startTimer();
                isRunning = true;
            }
        } else {
            document.body.style.backgroundColor = "var(--bg-color)";
            state = "idle";
        }
    }
</script>

<svelte:window
    on:keydown={(key) => handleKeydown(key)}
    on:keyup={(key) => handleKeyup(key)}
/>

{#if !isRunning}
    <div class="p-8 flex gap-6">
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
                items={themeList
                    .sort((a, b) =>
                        a.name > b.name ? 1 : a.name < b.name ? -1 : 0,
                    )
                    .map((color) => ({
                        name:
                            color.displayName ??
                            color.name
                                .split("_")
                                .map(
                                    (word) =>
                                        word[0].toUpperCase() +
                                        word.substring(1),
                                )
                                .join(" "),
                        value: color,
                    }))}
                on:change={() => updateColors()}
            ></Select>
        </Label>
        <Label>
            <p class="text-text">Session</p>

            <Select
                bind:value={currentSession}
                items={sessions.map((session) => ({
                    value: session.id,
                    name: session.name,
                }))}
                on:change={() => changeSession()}
            ></Select>
        </Label>
    </div>
    <div class="flex flex-col items-center text-text">
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

    <div class="grid grid-cols-2 gap-6">
        {#if times.length}
            <Summary bind:times></Summary>
        {/if}
        <div id="twisty-player"></div>
    </div>
    <div>
        <div class="grid grid-cols-12 font-bold">
            <p>Time</p>
            <p class="col-span-8">Scramble</p>
            <p class="col-span-3">Created At</p>
        </div>
        {#each times.reverse() as time}
            <div class="grid grid-cols-12">
                <Button
                    on:click={() => {
                        console.log(time.time);
                        selectedTime = time;
                        showTimeModal = true;
                    }}
                >
                    {#if time.isDNF}
                        <p class="text-text">DNF</p>
                    {:else}
                        <p class="text-text">
                            {time.time}
                        </p>
                    {/if}
                </Button>
                <p class="col-span-8 text-text">{time.scramble}</p>
                <p class="col-span-3 text-text">
                    {new Date(time.createdAt).toDateString()}
                </p>
            </div>
        {/each}
    </div>
{:else}
    <div class="flex h-full justify-center items-center">
        <Center>
            <h1 class="text-text text-[288px]">{time}</h1>
        </Center>
    </div>
{/if}

<Modal title="Create Session" bind:open={showTimeModal} autoclose>
    <svelte:fragment slot="footer">
        <Button color="alternative" on:click={() => handleDeleteTime()}
            >Delete Time</Button
        >
        <Button color="alternative" on:click={() => handleDNF()}>DNF</Button>
    </svelte:fragment>
</Modal>
