<script lang="ts">
    import { type Time } from "$lib/utils/getTimes";

    export let times: Time[];

    $: ao12 = getAo12();
    $: ao5 = getAo5();
    $: ao3 = getAo3();
    $: best = getBest();
    $: average = getAverage();

    function getAo12() {
        if (times.length < 12) return "N/A";

        const slice = times.slice(0, 12);
        const dnfCount = slice.filter((time) => time.isDNF).length;

        if (dnfCount > 2) return "DNF";

        const sortedTimes = slice.sort(
            (a, b) => (a.time || Infinity) - (b.time || Infinity),
        );

        sortedTimes.pop();

        if (!dnfCount) {
            sortedTimes.shift();
        } else {
            for (let i = 0; i < dnfCount; i++) {
                sortedTimes.shift();
            }
        }

        return (
            sortedTimes.reduce((acc, time) => acc + time.time!, 0) /
            (10 - dnfCount)
        );
    }

    function getAo5() {
        if (times.length < 5) return "N/A";

        const slice = times.slice(0, 5);
        const dnfCount = slice.filter((time) => time.isDNF).length;

        if (dnfCount > 1) return "DNF";

        const sortedTimes = slice.sort(
            (a, b) => (a.time || Infinity) - (b.time || Infinity),
        );
        sortedTimes.pop();
        sortedTimes.shift();

        return sortedTimes.reduce((acc, time) => acc + time.time!, 0) / 3;
    }

    function getAo3() {
        // No DNFs
        if (times.length < 3) return "N/A";

        return (
            times
                .reverse()
                .slice(0, 3)
                .reduce((acc, time) => acc + time.time!, 0) / 3
        );
    }

    function getBest() {
        return Math.min(...times.map((time) => time.time || Infinity));
    }

    function getAverage() {
        return (
            times
                .filter((time) => time.isDNF)
                .reduce((acc, time) => acc + time.time!, 0) / times.length
        );
    }
</script>

<div>
    <h2>Summary</h2>

    <div>
        <h3>Best Time</h3>
        <p>{best}</p>

        <h3>Average Time</h3>
        <p>{average}</p>

        <h3>Average of 3</h3>
        <p>{ao3}</p>

        <h3>Average of 5</h3>
        <p>{ao5}</p>

        <h3>Average of 12</h3>
        <p>{ao12}</p>
    </div>
</div>
