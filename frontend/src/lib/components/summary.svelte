<script lang="ts">
    import { type Time } from "$lib/services/timeService";
    import { round } from "$lib/utils/round";

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

        return round(
            sortedTimes.reduce((acc, time) => acc + time.time!, 0) /
                (10 - dnfCount),
            2,
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

        return round(
            sortedTimes.reduce((acc, time) => acc + time.time!, 0) / 3,
            2,
        );
    }

    function getAo3() {
        // No DNFs
        if (times.length < 3) return "N/A";

        return round(
            times
                .reverse()
                .slice(0, 3)
                .reduce((acc, time) => acc + time.time!, 0) / 3,
            2,
        );
    }

    function getBest() {
        return Math.min(...times.map((time) => time.time || Infinity));
    }

    function getAverage() {
        return round(
            times
                .filter((time) => time.isDNF)
                .reduce((acc, time) => acc + time.time!, 0) / times.length,
            2,
        );
    }
</script>

<div>
    <div>
        <p class="font-bold text-sub">last</p>
        <h3 class="font-bold text-main text-[96px]">{times[0].time}</h3>
    </div>
    <div class="grid grid-cols-2 gap-6">
        <div>
            <p class="font-bold text-sub">total</p>
            <h3 class="font-bold text-main text-3xl">{times.length}</h3>
        </div>
        <div>
            <p class="font-bold text-sub">best</p>
            <h3 class="font-bold text-main text-3xl">{best}</h3>
        </div>

        <div>
            <p class="font-bold text-sub">average</p>
            <h3 class="font-bold text-main text-3xl">{average}</h3>
        </div>

        <div>
            <p class="font-bold text-sub">ao3</p>
            <h3 class="font-bold text-main text-3xl">{ao3}</h3>
        </div>

        <div>
            <p class="font-bold text-sub">ao5</p>
            <h3 class="font-bold text-main text-3xl">{ao5}</h3>
        </div>

        <div>
            <p class="font-bold text-sub">ao12</p>
            <h3 class="font-bold text-main text-3xl">{ao12}</h3>
        </div>
    </div>
</div>
