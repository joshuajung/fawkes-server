import { App } from "../../types";
export declare const findById: (app: App, id: string) => Promise<any>;
export declare const findByEmail: (app: App, email: string) => Promise<any>;
export declare const findByAppleIdentifier: (app: App, appleIdentifier: string) => Promise<any>;
export declare const findByResetPasswordToken: (app: App, resetPasswordToken: string) => Promise<any>;
export declare const findByLoginToken: (app: App, loginToken: string) => Promise<any>;
export declare const findByAccessToken: (app: App, accessToken: string) => Promise<any>;
export declare const getRichUserRecordById: (app: App, userId: string) => Promise<{
    userId: any;
    email: any;
    userGroups: any;
}>;
