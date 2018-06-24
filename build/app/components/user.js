"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const cryptoHelper = require("../helpers/crypto");
const userSettingsHelper = require("../helpers/userSettings");
const queries_1 = require("../database/queries");
exports.createWithEmail = (app, email, password) => __awaiter(this, void 0, void 0, function* () {
    if (!app.module.user.registrationOpen)
        throw Error("REGISTRATION_CLOSED");
    if (typeof password !== "string")
        throw Error("INVALID_INPUT");
    if (validator.isLength(password, { min: app.module.user.minPasswordLength }) ===
        false)
        throw Error("INVALID_INPUT");
    if (typeof email !== "string")
        throw Error("INVALID_INPUT");
    if (validator.isEmail(email) === false)
        throw Error("INVALID_INPUT");
    const userExists = yield exports.exists(app, email);
    if (userExists) {
        throw Error("EMAIL_IN_USE");
    }
    else {
        const userId = cryptoHelper.createGuid();
        yield app.db.execute(queries_1.default.user.createUser(), [
            userId,
            email,
            cryptoHelper.hashPassword.generate(password)
        ]);
        return userId;
    }
});
exports.setNewPasswordWithOldPassword = (app, userId, passwordNew, passwordOld) => __awaiter(this, void 0, void 0, function* () {
    if (typeof passwordOld !== "string")
        throw Error("INVALID_INPUT");
    if (typeof passwordNew !== "string")
        throw Error("INVALID_INPUT");
    if (validator.isLength(passwordNew, {
        min: app.module.user.minPasswordLength
    }) === false)
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserById(), [
        userId
    ]))[0];
    if (userRecords.length === 0) {
        throw Error("USER_DOES_NOT_EXIST");
    }
    if (cryptoHelper.hashPassword.verify(passwordOld, userRecords[0].password) ===
        false) {
        throw Error("PASSWORD_INCORRECT");
    }
    const hashedPassword = cryptoHelper.hashPassword.generate(passwordNew);
    yield app.db.execute(queries_1.default.user.setNewPasswordForUserId(), [
        hashedPassword,
        userId
    ]);
});
exports.setNewPasswordWithToken = (app, token, passwordNew) => __awaiter(this, void 0, void 0, function* () {
    if (typeof token !== "string")
        throw Error("INVALID_INPUT");
    if (typeof passwordNew !== "string")
        throw Error("INVALID_INPUT");
    if (validator.isLength(passwordNew, {
        min: app.module.user.minPasswordLength
    }) === false)
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByResetPasswordToken(), [token]))[0];
    if (userRecords.length === 0) {
        throw Error("USER_DOES_NOT_EXIST");
    }
    const userId = userRecords[0]["id"];
    if (userRecords[0].resetPasswordToken !== token) {
        throw Error("RESET_PASSWORD_TOKEN_INCORRECT");
    }
    const hashedPassword = cryptoHelper.hashPassword.generate(passwordNew);
    yield app.db.execute(queries_1.default.user.setNewPasswordForUserId(), [
        hashedPassword,
        userId
    ]);
    yield app.db.execute(queries_1.default.user.setResetPasswordToken(), [null, userId]);
    yield app.db.execute(queries_1.default.user.resetLoginLockForUserId(), [userId]);
});
exports.sendResetPasswordLink = (app, email = null, resetPasswordLinkBaseUrl) => __awaiter(this, void 0, void 0, function* () {
    if (typeof email !== "string")
        throw Error("INVALID_INPUT");
    if (validator.isEmail(email) === false)
        throw Error("INVALID_INPUT");
    if (typeof resetPasswordLinkBaseUrl !== "string")
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByEmail(), [
        email
    ]))[0];
    if (userRecords.length === 0) {
        throw Error("USER_DOES_NOT_EXIST");
    }
    else {
        const resetPasswordToken = cryptoHelper.createRandomString();
        yield app.db.execute(queries_1.default.user.setResetPasswordToken(), [
            resetPasswordToken,
            userRecords[0].id
        ]);
        const mail = {
            from: app.module.mailer.sender,
            to: userRecords[0].email,
            subject: "Your reset password link",
            text: "Your reset password link is: " +
                resetPasswordLinkBaseUrl +
                resetPasswordToken
        };
        yield app.mailer.sendMail(mail);
    }
});
exports.setSetting = (app, userId, settingKey, settingValue) => __awaiter(this, void 0, void 0, function* () {
    if (typeof settingKey !== "string")
        throw Error("INVALID_INPUT");
    yield app.db.execute(queries_1.default.user.setUserSetting(), [
        cryptoHelper.createGuid(),
        userId,
        settingKey,
        settingValue.toDb(),
        settingValue.toDb()
    ]);
});
exports.setSettings = (app, userId, settings) => __awaiter(this, void 0, void 0, function* () {
    yield Promise.all(settings.map((setting) => __awaiter(this, void 0, void 0, function* () {
        return exports.setSetting(app, userId, setting.settingKey, setting.settingValue);
    })));
});
exports.settings = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    const rawResults = yield app.db.execute(queries_1.default.user.getUserSettings(), [
        userId
    ]);
    return app.module.userSettings
        .map(userSettingDefinition => {
        const rawValueRow = rawResults[0].find(row => row["settingKey"] === userSettingDefinition.key);
        return Object.assign({}, userSettingDefinition, { value: userSettingsHelper.parseFromDb(app, rawValueRow, userSettingDefinition) });
    })
        .filter(s => s);
});
exports.createSession = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (typeof userId !== "string")
        throw Error("INVALID_INPUT");
    yield app.db.execute(queries_1.default.user.resetLoginLockForUserId(), [userId]);
    yield app.db.execute(queries_1.default.user.updateLastSuccessfulLoginForUserId(), [
        userId
    ]);
    const accessToken = cryptoHelper.createRandomString();
    const query = queries_1.default.user.createSession(app.module.user.sessionTimeout);
    yield app.db.execute(query, [accessToken, userId]);
    return {
        accessToken
    };
});
exports.logInWithEmail = (app, email, password) => __awaiter(this, void 0, void 0, function* () {
    if (typeof email !== "string")
        throw Error("INVALID_INPUT");
    if (validator.isEmail(email) === false)
        throw Error("INVALID_INPUT");
    if (typeof password !== "string")
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByEmail(), [
        email
    ]))[0];
    if (userRecords.length === 0) {
        throw Error("USER_DOES_NOT_EXIST");
    }
    const lockedStatusRecords = (yield app.db.execute(queries_1.default.user.checkLoginLockForUserId(), [userRecords[0].id]))[0];
    if (lockedStatusRecords[0].loginIsLockedNow) {
        throw Error("LOGIN_LOCKED");
    }
    if (cryptoHelper.hashPassword.verify(password, userRecords[0].password) ===
        false) {
        yield app.db.execute(queries_1.default.user.increaseFailedLoginAttemptsForUserId(), [
            userRecords[0].id
        ]);
        const lockResult = yield app.db.execute(queries_1.default.user.lockUserLoginByUserId(app.module.user.loginLockTimeout), [userRecords[0].id, app.module.user.failedLoginAttemptsUntilLock]);
        const userLocked = lockResult[0].affectedRows > 0 ? true : false;
        if (userLocked) {
            throw Error("LOGIN_LOCKED");
        }
        else {
            throw Error("PASSWORD_INCORRECT");
        }
    }
    return yield exports.createSession(app, userRecords[0].id);
});
exports.logInWithToken = (app, token) => __awaiter(this, void 0, void 0, function* () {
    if (typeof token !== "string")
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByLoginToken(), [token]))[0];
    if (userRecords.length === 0) {
        throw Error("USER_DOES_NOT_EXIST");
    }
    const userId = userRecords[0]["id"];
    yield app.db.execute(queries_1.default.user.setLoginToken(), [null, userId]);
    return yield exports.createSession(app, userId);
});
exports.exists = (app, email) => __awaiter(this, void 0, void 0, function* () {
    if (typeof email !== "string")
        throw Error("INVALID_INPUT");
    if (validator.isEmail(email) === false)
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByEmail(), [
        email
    ]))[0];
    if (userRecords.length === 0) {
        return false;
    }
    else if (userRecords.length === 1) {
        return true;
    }
    else {
        throw Error("OTHER_ERROR");
    }
});
exports.sendLoginLink = (app, email = null, loginLinkBaseUrl) => __awaiter(this, void 0, void 0, function* () {
    if (typeof email !== "string")
        throw Error("INVALID_INPUT");
    if (validator.isEmail(email) === false)
        throw Error("INVALID_INPUT");
    if (typeof loginLinkBaseUrl !== "string")
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByEmail(), [
        email
    ]))[0];
    if (userRecords.length === 0) {
        throw Error("USER_DOES_NOT_EXIST");
    }
    else {
        const userId = userRecords[0].id;
        const loginToken = cryptoHelper.createRandomString();
        yield app.db.execute(queries_1.default.user.setLoginToken(), [loginToken, userId]);
        const mail = {
            from: app.module.mailer.sender,
            to: userRecords[0].email,
            subject: "Your Login Link",
            text: "Your login link is: " + loginLinkBaseUrl + loginToken
        };
        yield app.mailer.sendMail(mail);
    }
});
exports.destroySession = (app, accessToken) => __awaiter(this, void 0, void 0, function* () {
    const query = queries_1.default.user.deleteSession();
    const queryResult = yield app.db.execute(query, [accessToken]);
    const numberOfTokensDestroyed = queryResult[0].affectedRows;
    if (numberOfTokensDestroyed !== 1)
        throw Error("OTHER_ERROR");
});
exports.destroyAllSessions = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    const query = queries_1.default.user.deleteAllSessionsForUserId();
    yield app.db.execute(query, [userId]);
});
exports.checkAndRefreshSession = (app, accessToken) => __awaiter(this, void 0, void 0, function* () {
    const query = queries_1.default.user.refreshSession(app.module.user.sessionTimeout);
    const queryResult = yield app.db.execute(query, [accessToken]);
    if (queryResult[0].affectedRows === 1) {
        return true;
    }
    else {
        return false;
    }
});
exports.getUserForSessionToken = (app, accessToken) => __awaiter(this, void 0, void 0, function* () {
    const userQuery = queries_1.default.user.getUserForSessionToken();
    const userQueryResult = yield app.db.execute(userQuery, [accessToken]);
    const userRecords = userQueryResult[0];
    if (userRecords.length === 0)
        return null;
    const userRecord = userQueryResult[0][0];
    const userGroupQuery = queries_1.default.user.getUserGroupsForUserId();
    const userGroupQueryResult = yield app.db.execute(userGroupQuery, [
        userRecord["id"]
    ]);
    const userGroupRecords = userGroupQueryResult[0];
    return {
        userId: userRecord.id,
        email: userRecord.email,
        userGroups: userGroupRecords.map(userGroupRecord => userGroupRecord.key)
    };
});
exports.addToGroup = (app, userId, groupKey) => __awaiter(this, void 0, void 0, function* () {
    if (typeof userId !== "string")
        throw Error("INVALID_INPUT");
    if (typeof groupKey !== "string")
        throw Error("INVALID_INPUT");
    const query = queries_1.default.user.addUserIdToGroup();
    const queryResult = yield app.db.execute(query, [
        cryptoHelper.createGuid(),
        userId,
        groupKey
    ]);
    if (queryResult[0].affectedRows !== 1) {
        throw Error("USER_NOT_ADDED_TO_GROUP");
    }
});
//# sourceMappingURL=user.js.map