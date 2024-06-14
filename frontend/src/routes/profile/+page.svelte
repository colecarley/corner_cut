<script lang="ts">
    import {
        cubeTypeById,
        cubeTypes,
        type cubeTypeId,
    } from "$lib/lookups/cubeTypes";
    import {
        createSession,
        getSessions,
        removeSession,
        saveSession,
        type Session,
    } from "$lib/services/sessionService";
    import { currentSession$ } from "$lib/store/currentSession";
    import { sessions$ } from "$lib/store/sessions";
    import {
        Button,
        Card,
        Input,
        Label,
        Modal,
        Select,
        Textarea,
    } from "flowbite-svelte";
    import { PlusOutline, TrashBinSolid } from "flowbite-svelte-icons";
    import { onMount } from "svelte";

    let sessions: Session[] = [];
    sessions$.subscribe((value) => {
        sessions = value;
    });

    let currentSession: string;
    currentSession$.subscribe((value) => {
        if (value) {
            currentSession = value?.id;
        }
    });

    onMount(() => {
        getSessions();
    });

    let showModal = false;
    function createNewSession() {
        showModal = false;
        if (!form.sessionName) {
            return;
        }
        if (!form.scrambleType) {
            form.scrambleType = "none";
        }

        const session = createSession(
            form.sessionName,
            form.scrambleType as cubeTypeId,
            form.description,
        );
        saveSession(session);
    }

    function deleteSession(sessionId: string) {
        removeSession(sessionId);
    }

    let form = { sessionName: "", scrambleType: "", description: "" };
</script>

<div class="flex gap-4">
    {#each sessions as session}
        <Card
            class="{currentSession === session.id
                ? 'border-main border-4'
                : 'border-sub-alt border-4'} bg-sub-alt"
        >
            <div class="flex justify-between items-start">
                <div>
                    <h5 class="text-lg font-bold text-main">{session.name}</h5>
                    <p class="text-text">
                        {session.scrambleType
                            ? session.scrambleType === "none"
                                ? "none"
                                : cubeTypeById[session.scrambleType].name
                            : ""}
                    </p>
                </div>
                <Button
                    on:click={(event) => {
                        event.stopPropagation();
                        deleteSession(session.id);
                    }}
                >
                    <TrashBinSolid color="var(--sub-color)" />
                </Button>
            </div>
            {#if session.description}
                <div>
                    <p class="text-text">{session.description}</p>
                </div>
            {/if}
        </Card>
    {/each}
</div>

<Modal title="Create Session" bind:open={showModal} autoclose>
    <Label for="session_name" class="mb-2">
        Session Name
        <Input
            type="text"
            id="session_name"
            placeholder="Playground"
            required
            bind:value={form.sessionName}
        />
    </Label>
    <Label>
        Scramble Type
        <Select
            placeholder="3x3x3"
            bind:value={form.scrambleType}
            items={cubeTypes.map((c) => ({ ...c, value: c.id }))}
            required
        />
    </Label>
    <Label for="description" class="mb-2">
        Description
        <Textarea
            type="text"
            id="description"
            placeholder="This is a description"
            bind:value={form.description}
        />
    </Label>
    <svelte:fragment slot="footer">
        <Button
            color="alternative"
            on:click={() => createNewSession()}
            disabled={!form.sessionName}>Create</Button
        >
    </svelte:fragment>
</Modal>
<Button
    class="absolute end-6 bottom-16 rounded-full bg-main aspect-square"
    on:click={() => {
        console.log("clicked");
        showModal = true;
    }}
>
    <PlusOutline size="lg" />
</Button>
