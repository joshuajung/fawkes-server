import { App } from "../../types";
export declare const idExists: (app: App, userId: string) => Promise<boolean>;
export declare const emailExists: (app: App, email: string) => Promise<boolean>;
export declare const appleIdentifierExists: (app: App, appleIdentifier: string) => Promise<boolean>;
