<script lang="ts">
    import { goto } from "$app/navigation";
    import { cubeTypes, type cubeTypeId } from "$lib/lookups/cubeTypes";
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
            on:click={() => {
                // form.sessionName = session.name;
                // form.scrambleType = session.scrambleType ?? "none";
                // showModal = true;
                goto(`/session/${session.id}`);
            }}
        >
            <Button
                on:click={(event) => {
                    event.stopPropagation();
                    deleteSession(session.id);
                }}><p class="bg-main">delete</p></Button
            >
            <h5>{session.name}</h5>
            <p>{session.scrambleType}</p>
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
