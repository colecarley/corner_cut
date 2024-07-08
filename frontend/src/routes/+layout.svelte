<script lang="ts">
    import { page } from "$app/stores";
    import {
        createSession,
        getSessions,
        saveSession,
        type Session,
    } from "$lib/services/sessionService";
    import { currentSession$ } from "$lib/store/currentSession";
    import { sessions$ } from "$lib/store/sessions";
    import { keyBy } from "$lib/utils/keyBy";
    import { Select, Tooltip } from "flowbite-svelte";
    import {
        ChartLineUpOutline,
        ClockSolid,
        HomeSolid,
        UserSolid,
    } from "flowbite-svelte-icons";
    import { onMount } from "svelte";
    import "../app.css";
    import { themes, type ThemeId } from "../themes/_list";
    import { updateConfig } from "$lib/services/configService";
    import { config$ } from "$lib/store/config";
    import { cubeTypes, type cubeTypeId } from "$lib/lookups/cubeTypes";
    import { getScramble } from "$lib/services/scrambleService";
    import { currentScramble$ } from "$lib/store/currentScramble";
    import { currentScrambleType$ } from "$lib/store/currentScrambleType";

    let selectedColor: ThemeId = "material";
    function updateColors() {
        updateConfig({ color: selectedColor });
    }

    function updateScramble() {
        currentScramble$.set(getScramble(scrambleType));
        currentScrambleType$.set(scrambleType);
    }

    let scrambleType: cubeTypeId = "333";
    currentScrambleType$.subscribe((value) => {
        if (!value) return;
        scrambleType = value;
    });

    let currentSession: string;
    currentSession$.subscribe((value) => {
        if (!value) return;
        currentSession = value?.id;
    });

    let sessions: Session[] = [];
    let sessionsById: Record<string, Session> = {};
    sessions$.subscribe((value) => {
        sessions = value;
        sessionsById = keyBy(value, "id");
    });

    let activePage = "";
    page.subscribe((value) => {
        activePage = value.url.pathname;
    });

    onMount(() => {
        getSessions();
        let scramble = getScramble(scrambleType);
        currentScramble$.set(scramble);
        currentScrambleType$.set(scrambleType);

        if (!sessions.length) {
            saveSession(createSession("playground", "333", "first session!"));
        }
        currentSession$.set(sessions[0]);

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
        });
    });

    function changeSession() {
        currentSession$.set(sessionsById[currentSession]);
    }
</script>

<div class="py-8 px-48 h-full w-full">
    <header class="flex justify-between">
        <div class="flex items-center gap-8">
            <h1 class="text-[36px] font-bold font-sans">corner cut</h1>
            <nav class="flex gap-4 items-center">
                <a href="/timer">
                    <ClockSolid
                        size="lg"
                        class="hover:text-text {activePage === '/timer'
                            ? 'text-text'
                            : 'text-sub'}"
                    />
                </a>
                <a href="/session/{currentSession}">
                    <ChartLineUpOutline
                        size="lg"
                        class="hover:text-text {activePage ===
                        `/session/${currentSession}`
                            ? 'text-text'
                            : 'text-sub'}"
                    />
                </a>
                <a href="/profile">
                    <UserSolid
                        size="lg"
                        class="hover:text-text {activePage === '/profile'
                            ? 'text-text'
                            : 'text-sub'}"
                    />
                </a>
            </nav>
        </div>
        <div class="flex items-center gap-8">
            {#if activePage !== "/"}
                <Select
                    placeholder="Select Scramble Type"
                    underline={true}
                    bind:value={scrambleType}
                    items={cubeTypes.map((c) => ({ ...c, value: c.id }))}
                    on:change={() => updateScramble()}
                />
                <Select
                    placeholder="Select Session"
                    underline={true}
                    bind:value={currentSession}
                    items={sessions.map((session) => ({
                        value: session.id,
                        name: session.name,
                    }))}
                    on:change={() => changeSession()}
                ></Select>
                <Tooltip placement="bottom">current session</Tooltip>
            {/if}
            <a href="/">
                <HomeSolid
                    size="lg"
                    class="hover:text-text {activePage === '/'
                        ? 'text-text'
                        : 'text-sub'}"
                />
            </a>
        </div>
    </header>
    <div class="py-12">
        <slot></slot>
    </div>
    <footer class="fixed left-0 bottom-0 w-full bg-main p-2 px-6">
        <div class="flex justify-between">
            <p>made with &lt3 - cole</p>
            <Select
                class="w-fit"
                placeholder="Select Theme"
                underline={true}
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
        </div>
    </footer>
</div>
