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

    let currentSession: string;
    currentSession$.subscribe((value) => {
        if (value) {
            currentSession = value?.id;
        }
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

        if (!sessions.length) {
            saveSession(createSession("playground", "333", "first session!"));
        }
        currentSession$.set(sessions[0]);
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
        <p>made with &lt3 - cole</p>
    </footer>
</div>
