import { App } from "../../types";
export declare const createUserId: () => any;
export declare const createWithEmail: (app: App, email: string, password: string) => Promise<string>;
export declare const createWithAppleIdentifier: (app: App, appleIdentifier: string) => Promise<string>;
