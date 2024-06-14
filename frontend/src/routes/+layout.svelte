<script lang="ts">
    import { Select } from "flowbite-svelte";
    import "../app.css";
    import {
        ChartLineUpOutline,
        ChartOutline,
        ChartPieSolid,
        ClockSolid,
        DatabaseSolid,
    } from "flowbite-svelte-icons";
    import { UserSolid } from "flowbite-svelte-icons";
    import { HomeSolid } from "flowbite-svelte-icons";
    import { currentSession$ } from "$lib/store/currentSession";
    import {
        createSession,
        getSessions,
        saveSession,
        type Session,
    } from "$lib/services/sessionService";
    import { onMount } from "svelte";
    import { sessions$ } from "$lib/store/sessions";
    import { keyBy } from "$lib/utils/keyBy";
    import { page } from "$app/stores";

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
            saveSession(createSession("Playground", "333"));
        }
        currentSession$.set(sessions[0]);
    });

    function changeSession() {
        currentSession$.set(sessionsById[currentSession]);
    }
</script>

<div class="py-8 px-48">
    <div class="flex justify-between">
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
                <a href="/profile">
                    <UserSolid
                        size="lg"
                        class="hover:text-text {activePage === '/profile'
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
    </div>
    <div class="py-12">
        <slot></slot>
    </div>
</div>
