<script lang="ts">
    import { cubeTypes, type cubeTypeId } from "$lib/lookups/cubeTypes";
    import {
        createSession,
        getSessions,
        removeSession,
        saveSession,
        type Session,
    } from "$lib/utils/getTimes";
    import { Button, Modal, Card, Label, Input, Select } from "flowbite-svelte";
    import { onMount } from "svelte";

    let sessions: Session[] = [];
    onMount(() => {
        sessions = getSessions();
    });

    let showModal = false;
    function createNewSession() {
        showModal = false;

        const session = createSession(
            form.sessionName,
            form.scrambleType as cubeTypeId,
        );
        saveSession(session);
        sessions = getSessions();
    }

    function deleteSession(sessionId: string) {
        removeSession(sessionId);
        sessions = getSessions();
    }

    let form = { sessionName: "Playground", scrambleType: "333" };
</script>

<div class="grid grid-cols-2 gap-4">
    {#each sessions as session}
        <Card
            on:click={() => {
                form.sessionName = session.name;
                form.scrambleType = session.scrambleType ?? "none";
                showModal = true;
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
<Modal title="Terms of Service" bind:open={showModal} autoclose>
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
