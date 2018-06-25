import { App } from "../types";
export declare const error: (app: App) => Promise<never>;
export declare const debug: (app: App) => Promise<void>;
export declare const getSocketForSession: (app: App) => Promise<void>;
