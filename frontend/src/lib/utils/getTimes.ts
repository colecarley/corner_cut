import { times } from "$lib/store/times";

export function getTimes() {
    const storedTimes = JSON.parse(localStorage.getItem("times") ?? "[]");
    times.set(storedTimes);
    return storedTimes;
}