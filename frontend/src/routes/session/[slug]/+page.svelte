<script lang="ts">
    import { page } from "$app/stores";
    import {
        getSession,
        getTimes,
        type Session,
        type Time,
    } from "$lib/utils/getTimes";
    import {
        VisArea,
        VisAxis,
        VisLine,
        VisScatter,
        VisStackedBar,
        VisCrosshair,
        VisTooltip,
        VisXYContainer,
    } from "@unovis/svelte";
    import { Scatter, StackedBar } from "@unovis/ts";
    import { Label, Select } from "flowbite-svelte";
    import { onMount } from "svelte";

    const sessionId = $page.params.slug;

    let selectedPlotType = "line";
    const plotTypes = [
        { name: "line", value: "line" },
        { name: "scatter", value: "scatter" },
        { name: "area", value: "area" },
        { name: "stacked bar", value: "stacked bar" },
    ];

    type DataRecord = {
        x: number;
        y: number;
    } & Time;

    const x = (d: DataRecord) => d.x;
    const y = (d: DataRecord) => d.y;
    const xTickFormat = (tick: number): string => {
        return new Date(data[tick]?.createdAt).toDateString();
    };
    const yTickFormat = (tick: number): number => {
        return data[tick]?.time ?? 0;
    };

    const triggerFn = (d: DataRecord) => {
        return `<span>${d.scramble}</span>`;
    };

    const triggers = {
        [Scatter.selectors.point]: triggerFn,
        [StackedBar.selectors.bar]: triggerFn,
    };

    let times: Time[] = [];
    let data: DataRecord[] = [];
    let session: Session;
    onMount(() => {
        session = getSession(sessionId);
        times = getTimes(sessionId);
        data = times
            .filter((x) => !x.isDNF)
            .map((time, i) => ({
                ...time,
                x: i,
                y: time.time ?? 0,
            }));
    });
</script>

<h1>Session</h1>
<Label>
    <p class="text-text">Plot Type</p>
    <Select items={plotTypes} bind:value={selectedPlotType}></Select>
</Label>

<VisXYContainer {data}>
    <VisAxis
        type="x"
        {x}
        tickFormat={xTickFormat}
        labelColor="var(--sub-color)"
        tickTextColor="var(--sub-color)"
    />
    <VisAxis
        type="y"
        {y}
        tickFormat={yTickFormat}
        labelColor="var(--sub-color)"
        tickTextColor="var(--sub-color)"
    />
    {#if selectedPlotType === "line"}
        <VisLine {x} {y} color="var(--main-color)" />
        <VisCrosshair {x} {y} {data} />
    {:else if selectedPlotType === "scatter"}
        <VisScatter
            {x}
            {y}
            label={y}
            color="var(--main-color)"
            labelColor="var(--sub-color)"
        />
    {:else if selectedPlotType === "area"}
        <VisArea {x} {y} color="var(--main-color)" />
    {:else if selectedPlotType === "stacked bar"}
        <VisStackedBar {x} {y} color="var(--main-color)" />
    {:else}
        <VisScatter
            {x}
            {y}
            label={y}
            color="var(--main-color)"
            labelColor="var(--sub-color)"
        />
    {/if}
    <VisTooltip {triggers} />
</VisXYContainer>

<style>
    :root {
        --vis-axis-grid-color: var(--sub-alt-color);
        --vis-crosshair-line-stroke-color: var(--sub-color);
        --vis-tooltip-background-color: var(--bg-color);
        --vis-tooltip-text-color: var(--text-color);
    }
</style>
