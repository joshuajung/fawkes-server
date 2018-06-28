import { App } from "../../types";
export declare const addToGroup: (app: App, userId: string, groupKey: string) => Promise<void>;
export declare const groupsForUser: (app: App, userId: string) => Promise<any>;
