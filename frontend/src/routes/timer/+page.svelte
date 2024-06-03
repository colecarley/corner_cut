<script lang="ts">
    import Center from "$lib/components/center.svelte";
    import { cubeTypes, type cubeTypeId } from "$lib/lookups/cubeTypes";
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
    import { Button, Label, Select, Modal } from "flowbite-svelte";
    import { onMount } from "svelte";
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
    });

    function changeSession() {
        times = getTimes(currentSession);
    }

    function updateScramble() {
        scramble = getScramble(scrambleType);
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
                items={themeList.map((color) => ({
                    name: color.name,
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
