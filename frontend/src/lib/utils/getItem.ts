
export function getItem(key: string, defaultValue: any) {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
}