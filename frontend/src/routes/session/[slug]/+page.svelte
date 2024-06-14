<script lang="ts">
    import { page } from "$app/stores";
    import Summary from "$lib/components/summary.svelte";
    import { cubeTypeById } from "$lib/lookups/cubeTypes";
    import { getSession, type Session } from "$lib/services/sessionService";
    import { getTimes, type Time } from "$lib/services/timeService";
    import { times$ } from "$lib/store/times";
    import {
        VisArea,
        VisAxis,
        VisCrosshair,
        VisLine,
        VisScatter,
        VisStackedBar,
        VisTooltip,
        VisXYContainer,
    } from "@unovis/svelte";
    import { Scatter, StackedBar } from "@unovis/ts";
    import { Button, Select, Tooltip } from "flowbite-svelte";
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
        return `<span>${d.isDNF ? "DNF" : d.time}</br>${cubeTypeById[d.scrambleType].id}</br>${d.scramble}</span>`;
    };

    const triggers = {
        [Scatter.selectors.point]: triggerFn,
        [StackedBar.selectors.bar]: triggerFn,
    };

    let times: Time[] = [];
    let data: DataRecord[] = [];
    let session: Session;
    times$.subscribe((value) => {
        if (value) {
            times = value;
            data = times
                .filter((x) => !x.isDNF)
                .map((time, i) => ({
                    ...time,
                    x: i,
                    y: time.time ?? 0,
                }));

            console.log(times);
        }
    });
    onMount(() => {
        session = getSession(sessionId);
        getTimes(sessionId);
    });
</script>

<Select
    items={plotTypes}
    bind:value={selectedPlotType}
    placeholder="Select Plot Type"
    underline={true}
></Select>
<Tooltip>type of plot</Tooltip>
<div class="p-12 grid grid-cols-3">
    {#if times.length}
        <Summary {times} />
    {/if}
    <div class="col-span-2 flex items-center">
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
    </div>
</div>

<div>
    <div class="grid grid-cols-12 font-bold mb-6 p-4">
        <p class="text-main">time</p>
        <p class="col-span-8 text-main">scramble</p>
        <p class="col-span-3 text-main">created at</p>
    </div>
    {#each times.reverse() as time, i}
        <div class="grid grid-cols-12 p-4 {i % 2 == 0 ? 'bg-sub-alt' : ''}">
            <Button class="p-0 m-0 py-2 text-start focus:ring-0">
                <p class="text-xs pr-4">{i + 1}</p>
                {#if time.isDNF}
                    <p class="text-error w-full">DNF</p>
                {:else}
                    <p class="text-main w-full">
                        {time.time}
                    </p>
                {/if}
            </Button>
            <p class="col-span-8 text-sub flex items-center">{time.scramble}</p>
            <p class="col-span-3 text-sub flex items-center">
                {new Date(time.createdAt).toDateString()}
            </p>
        </div>
    {/each}
</div>

<style>
    :root {
        --vis-axis-grid-color: var(--sub-alt-color);
        --vis-crosshair-line-stroke-color: var(--sub-color);
        --vis-tooltip-background-color: var(--bg-color);
        --vis-tooltip-text-color: var(--text-color);
        --vis-crosshair-circle-stroke-color: var(---main-color);
    }
</style>
