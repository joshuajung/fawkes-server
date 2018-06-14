import * as Express from "express";
export interface Request extends Express.Request {
    userInfo?: {
        userId: string;
        email: string;
        userGroups: Array<string>;
    };
    userIsInGroup?: (groupKey: string) => boolean;
    accessToken?: string;
    accessTokenIsAvailable?: boolean;
    accessTokenIsInvalid?: boolean;
    userIsLoggedIn?: boolean;
    accessGranted?: boolean;
}
