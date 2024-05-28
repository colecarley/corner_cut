import { times } from "$lib/store/times";

export function saveTime(time: number) {
    times.update((times) => [...times, time]);
    const storedTimes = JSON.parse(localStorage.getItem("times") ?? "[]");
    localStorage.setItem("times", JSON.stringify([...storedTimes, time]));
}
