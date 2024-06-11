<script lang="ts">
    import Center from "$lib/components/center.svelte";
    import { cubeTypes, type cubeTypeId } from "$lib/lookups/cubeTypes";
    import { twistyPlayerCubeTypesById } from "$lib/lookups/twistyPlayerCubeTypes";
    import { getScramble } from "$lib/services/scrambleService";
    import {
        createTime,
        getTimes,
        removeTime,
        saveTime,
        updateTime,
        type Time,
    } from "$lib/services/timeService";
    import { TwistyPlayer, type PuzzleID } from "cubing/twisty";
    import { Button, Label, Modal, Select } from "flowbite-svelte";
    import { onMount } from "svelte";
    import { themes, type Theme, type ThemeId } from "../../themes/_list";
    import Summary from "$lib/components/summary.svelte";
    import {
        createSession,
        getSessions,
        saveSession,
        type Session,
    } from "$lib/services/sessionService";
    import { times$ } from "$lib/store/times";
    import { sessions$ } from "$lib/store/sessions";
    import { getConfig, updateConfig } from "$lib/services/configService";
    import { config$ } from "$lib/store/config";
    import { RefreshOutline } from "flowbite-svelte-icons";

    let selectedColor: ThemeId = "material";
    function updateColors() {
        updateConfig({ color: selectedColor });
    }

    let showTimeModal = false;
    let selectedTime: Time;

    let scramble: string = "";
    let scrambleType: cubeTypeId = "333";
    let sessions: Session[] = [];
    sessions$.subscribe((value) => {
        sessions = value;
    });
    let currentSession: string;
    let times: Time[] = [];
    times$.subscribe((value) => {
        times = value.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
        );
    });

    onMount(() => {
        config$.subscribe((value) => {
            if (!value.color) return;

            const stylesheets = document.querySelectorAll(
                "link[rel=stylesheet]",
            );

            for (const sheet of stylesheets) {
                sheet.parentElement?.removeChild(sheet);
            }

            const link = document.createElement("link");
            link.setAttribute("rel", "stylesheet");
            link.setAttribute(
                "href",
                `/Users/colecarley/src/corner_cut/frontend/src/themes/${value.color}.css`,
            );

            document.head.appendChild(link);
            updateTwistyPlayer();
        });

        scramble = getScramble(scrambleType);
        getSessions();
        if (!sessions.length) {
            saveSession(createSession("Playground", "333"));
        }
        currentSession = sessions[0]?.id;
        getConfig();
        getTimes(currentSession);
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
    }

    function handleDNF() {
        updateTime(currentSession, selectedTime.id, { isDNF: true });
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
        scramble = getScramble(scrambleType);
    }

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
                state = "idle";
                document.body.style.backgroundColor = "var(--bg-color)";
                endTimer();
            }
        }
    }

    function handleKeyup(key: KeyboardEvent) {
        if (state === "ready" && key.timeStamp - timeStamp >= 550) {
            if (key.code == "Space") {
                state = "running";
                document.body.style.backgroundColor = "var(--bg-color)";
                startTimer();
            }
        } else {
            document.body.style.backgroundColor = "var(--bg-color)";
            state = "idle";
        }
    }

    function foo(_: any) {
        updateTwistyPlayer();
    }
</script>

<svelte:window
    on:keydown={(key) => handleKeydown(key)}
    on:keyup={(key) => handleKeyup(key)}
/>

{#if state === "idle"}
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
                items={themes
                    .slice()
                    .sort((a, b) =>
                        a.name > b.name ? 1 : a.name < b.name ? -1 : 0,
                    )
                    .map((color) => ({
                        name: color.name.split("_").join(" "),
                        value: color.name,
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
    <div class="grid grid-cols-3">
        <div class="grid grid-cols-2 gap-6 p-6">
            {#if times.length}
                <Summary bind:times></Summary>
            {/if}
        </div>
        <div class="col-span-2">
            <div class="flex flex-col items-center text-text">
                <h1 class="text-[50px] p-4 rounded-2xl bg-sub-alt text-main">
                    <span class="hover:text-text">
                        {scramble}
                    </span>
                </h1>
                <Button
                    class="text-sub focus:ring-0"
                    on:click={() => updateScramble()}
                >
                    <RefreshOutline></RefreshOutline>
                </Button>
            </div>
            <div
                use:foo
                id="twisty-player"
                class="flex justify-center items-center"
            ></div>
        </div>
    </div>
{/if}
{#if state === "not ready"}
    <div class="flex h-full justify-center items-center">
        <Center>
            <h1 class="text-text text-[288px]">-</h1>
        </Center>
    </div>
{/if}
{#if state === "ready"}
    <div class="flex h-full justify-center items-center">
        <Center>
            <h1 class="text-text text-[288px]">+</h1>
        </Center>
    </div>
{/if}
{#if state === "running"}
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
