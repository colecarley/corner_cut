import { v4 as uuidv4 } from "uuid";
import { getSession } from "./sessionService";
import { times$ } from "$lib/store/times";
import type { Theme, ThemeId } from "../../themes/_list";
import { getItem } from "$lib/utils/getItem";
import { setItem } from "$lib/utils/setItem";
import { config$ } from "$lib/store/config";


type Config = {
    color: ThemeId;
    session: string; // session id
};

const CONFIG_KEY = "cornercut_config";

export function getConfig(): Config {
    const config = getItem(CONFIG_KEY, {});
    config$.set(config);
    return config;
}

export function updateConfig(updates: Partial<Config>) {
    const config = getConfig();
    config$.set({...config, ...updates});
    setItem(CONFIG_KEY, {...config, ...updates});
}
