<script lang="ts">
    import Center from "$lib/components/center.svelte";
    import Summary from "$lib/components/summary.svelte";
    import { cubeTypes, type cubeTypeId } from "$lib/lookups/cubeTypes";
    import { twistyPlayerCubeTypesById } from "$lib/lookups/twistyPlayerCubeTypes";
    import { getScramble } from "$lib/services/scrambleService";
    import {
        createSession,
        getSessions,
        saveSession,
        type Session,
    } from "$lib/services/sessionService";
    import {
        createTime,
        getTimes,
        removeTime,
        saveTime,
        updateTime,
        type Time,
    } from "$lib/services/timeService";
    import { currentScramble$ } from "$lib/store/currentScramble";
    import { currentScrambleType$ } from "$lib/store/currentScrambleType";
    import { currentSession$ } from "$lib/store/currentSession";
    import { sessions$ } from "$lib/store/sessions";
    import { times$ } from "$lib/store/times";
    import { TwistyPlayer, type PuzzleID } from "cubing/twisty";
    import { Button, Modal, Select, Tooltip } from "flowbite-svelte";
    import {
        BanOutline,
        RefreshOutline,
        TrashBinSolid,
    } from "flowbite-svelte-icons";
    import { onMount } from "svelte";

    let showTimeModal = false;

    let scramble: string = "";
    currentScramble$.subscribe((value) => {
        if (!value) return;
        scramble = value;
    });

    let sessions: Session[] = [];
    let scrambleType: cubeTypeId = "333";
    currentScrambleType$.subscribe((value) => {
        if (!value) return;
        scrambleType = value;
        updateScramble();
    });

    let times: Time[] = [];
    sessions$.subscribe((value) => {
        sessions = value;
    });
    let currentSession: string;
    currentSession$.subscribe((value) => {
        if (value) {
            currentSession = value.id;
            getTimes(currentSession);
            updateTwistyPlayer();
        }
    });
    times$.subscribe((value) => {
        times = value.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime(),
        );
    });

    onMount(() => {
        getSessions();
        if (!sessions.length) {
            saveSession(createSession("Playground", "333"));
        }
        currentScramble$.set(getScramble(scrambleType));
    });

    function updateTwistyPlayer() {
        if (!scramble) return;
        if (!scrambleType) return;

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

    function updateScramble() {
        currentScramble$.set(getScramble(scrambleType));
        updateTwistyPlayer();
    }

    function getLastTime() {
        if (!times.length) return;
        return times[0];
    }

    function handleDeleteTime() {
        const selectedTime = getLastTime();
        if (!selectedTime) return;
        removeTime(currentSession, selectedTime.id);
    }

    function handleDNF() {
        const selectedTime = getLastTime();
        if (!selectedTime) return;
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

        saveTime(
            currentSession,
            createTime(time, scrambleType, scramble, false),
        );
        currentScramble$.set(getScramble(scrambleType));
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
    <div class="bg-bg">
        <!-- <div class="flex gap-6"></div> -->
        <div class="grid grid-cols-3">
            {#if times.length}
                <Summary bind:times></Summary>
            {/if}
            <div class="col-span-2">
                <div class="flex flex-col items-center text-text">
                    <div class="rounded-2xl bg-sub-alt">
                        <Button
                            class="text-sub focus:ring-0"
                            on:click={() => handleDeleteTime()}
                        >
                            <TrashBinSolid class="hover:text-text"
                            ></TrashBinSolid>
                        </Button>
                        <Tooltip>delete last solve</Tooltip>
                        <Button
                            class="text-sub focus:ring-0"
                            on:click={() => handleDNF()}
                        >
                            <BanOutline class="hover:text-text"></BanOutline>
                        </Button>
                        <Tooltip>DNF last solve</Tooltip>
                        <Button
                            class="text-sub focus:ring-0"
                            on:click={() => updateScramble()}
                        >
                            <RefreshOutline class="hover:text-text"
                            ></RefreshOutline>
                        </Button>
                        <Tooltip>refresh scramble</Tooltip>
                    </div>
                    <Button
                        class="hover:text-text text-[36px] p-8 text-main focus:ring-0 font"
                        on:click={() => {
                            navigator.clipboard.writeText(scramble);
                        }}
                    >
                        {scramble}
                    </Button>
                    <Tooltip>click to copy</Tooltip>
                </div>
                <div
                    use:foo
                    id="twisty-player"
                    class="flex justify-center items-center"
                ></div>
            </div>
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
