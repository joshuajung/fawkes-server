import { App } from "../types";
import { AdvancedData } from "../../support";
export declare const createWithEmail: (app: App, email: string, password: string) => Promise<any>;
export declare const setNewPasswordWithOldPassword: (app: App, userId: string, passwordNew: string, passwordOld: string) => Promise<void>;
export declare const setNewPasswordWithToken: (app: App, token: string, passwordNew: string) => Promise<void>;
export declare const sendResetPasswordLink: (app: App, email: string, resetPasswordLinkBaseUrl: string) => Promise<void>;
export declare const setSetting: (app: App, userId: string, settingKey: string, settingValue: AdvancedData) => Promise<void>;
export declare const setSettings: (app: App, userId: string, settings: {
    settingKey: string;
    settingValue: AdvancedData;
}[]) => Promise<void>;
export declare const settings: (app: App, userId: string) => Promise<any[]>;
export declare const createSession: (app: App, userId: string) => Promise<{
    accessToken: string;
}>;
export declare const logInWithEmail: (app: App, email: string, password: string) => Promise<{
    accessToken: string;
}>;
export declare const logInWithToken: (app: App, token: string) => Promise<{
    accessToken: string;
}>;
export declare const exists: (app: App, email: string) => Promise<boolean>;
export declare const sendLoginLink: (app: App, email: string, loginLinkBaseUrl: string) => Promise<void>;
export declare const destroySession: (app: App, accessToken: string) => Promise<void>;
export declare const destroyAllSessions: (app: App, userId: string) => Promise<void>;
export declare const checkAndRefreshSession: (app: App, accessToken: string) => Promise<boolean>;
export declare const getUserForSessionToken: (app: App, accessToken: string) => Promise<{
    userId: any;
    email: any;
    userGroups: any;
}>;
export declare const addToGroup: (app: App, userId: string, groupKey: string) => Promise<void>;
