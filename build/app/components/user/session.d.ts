import { App } from "../../types";
export declare const startSession: (app: App, userId: string) => Promise<{
    userId: string;
    accessToken: string;
}>;
export declare const createSession: (app: App, userId: string) => Promise<string>;
export declare const logInWithEmail: (app: App, email: string, password: string) => Promise<{
    userId: string;
    accessToken: string;
}>;
export declare const logInWithAppleIdentifier: (app: App, appleIdentifier: string) => Promise<{
    userId: string;
    accessToken: string;
}>;
export declare const createUserOrLogInWithAppleIdentifier: (app: App, appleIdentifier: string) => Promise<{
    userId: string;
    accessToken: string;
}>;
export declare const logInWithToken: (app: App, token: string) => Promise<{
    userId: string;
    accessToken: string;
}>;
export declare const sendLoginLink: (app: App, email: string, loginLinkBaseUrl: string) => Promise<void>;
export declare const destroySession: (app: App, accessToken: string) => Promise<void>;
export declare const destroyAllSessions: (app: App, userId: string) => Promise<void>;
export declare const checkAndRefreshSession: (app: App, accessToken: string) => Promise<boolean>;
export declare const updateLastSuccessfulLogin: (app: App, userId: string) => Promise<any>;
export declare const setLoginToken: (app: App, userId: string) => Promise<string>;
