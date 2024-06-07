<script lang="ts">
    import { goto } from "$app/navigation";
    import {
        cubeTypeById,
        cubeTypes,
        type cubeTypeId,
    } from "$lib/lookups/cubeTypes";
    import {
        type Session,
        createSession,
        getSessions,
        removeSession,
        saveSession,
    } from "$lib/services/sessionService";
    import { sessions$ } from "$lib/store/sessions";
    import { Button, Card, Input, Label, Modal, Select } from "flowbite-svelte";
    import { onMount } from "svelte";
    import { CloseOutline } from "flowbite-svelte-icons";

    let sessions: Session[] = [];
    sessions$.subscribe((value) => {
        sessions = value;
    });

    onMount(() => {
        getSessions();
    });

    let showModal = false;
    function createNewSession() {
        showModal = false;

        const session = createSession(
            form.sessionName,
            form.scrambleType as cubeTypeId,
        );
        saveSession(session);
    }

    function deleteSession(sessionId: string) {
        removeSession(sessionId);
    }

    let form = { sessionName: "Playground", scrambleType: "333" };
</script>

<div class="grid grid-cols-2 gap-4">
    {#each sessions as session}
        <Card
            class="bg-sub-alt border-sub-alt"
            on:click={() => {
                goto(`/session/${session.id}`);
            }}
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
                    <CloseOutline color="var(--sub-color)" />
                </Button>
            </div>
        </Card>
    {/each}
</div>

<Button on:click={() => (showModal = true)}>New Session</Button>
<Modal title="Create Session" bind:open={showModal} autoclose>
    <Label for="session_name" class="mb-2">Session Name</Label>
    <Input
        type="text"
        id="session_name"
        placeholder="Playground"
        required
        bind:value={form.sessionName}
    />
    <Label>
        <p class="text-text">Scramble Type</p>
        <Select
            bind:value={form.scrambleType}
            items={cubeTypes.map((c) => ({ ...c, value: c.id }))}
            required
        />
    </Label>
    <svelte:fragment slot="footer">
        <Button color="alternative" on:click={() => createNewSession()}
            >Create</Button
        >
    </svelte:fragment>
</Modal>
