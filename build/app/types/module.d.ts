import * as types from "./index";
import * as advancedObjectHelper from "../helpers/advancedObject";
import * as userSettingsHelper from "../helpers/userSettings";
import * as schedulerHelper from "../helpers/scheduler";
export interface Module {
    appName: string;
    database: {
        host: string;
        port: number;
        user: string;
        password: string;
        database: string;
        poolSize: number;
    };
    mailer: {
        transporterConfiguration: {};
        sender: string;
    };
    server: {
        baseUrl: string;
    };
    environment: {
        testing: boolean;
        logErrors: boolean;
    };
    user: {
        registrationOpen: boolean;
        sessionTimeout: number;
        loginLockTimeout: number;
        failedLoginAttemptsUntilLock: number;
        loginLinkValidity: number;
        minPasswordLength: number;
        allowAppleIdentifierUserCreation: boolean;
        accessTokenHeaderName: string;
        accessTokenUrlParamName: string;
    };
    advancedObjects: Array<advancedObjectHelper.AdvancedObject>;
    scheduledJobs?: Array<schedulerHelper.ScheduledJobDefinition>;
    userSettings?: Array<userSettingsHelper.UserSetting>;
    setupAuthRoutes: (app: types.App) => void;
    setupExeRoutes: (app: types.App) => void;
}
