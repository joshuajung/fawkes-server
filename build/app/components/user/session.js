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
const cryptoHelper = require("../../helpers/crypto");
const queries_1 = require("../../database/queries");
const existsComponent = require("./exists");
const createComponent = require("./create");
const passwordComponent = require("./password");
const findComponent = require("./find");
const validateHelper = require("../../helpers/validate");
exports.startSession = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    yield passwordComponent.resetLoginLock(app, userId);
    yield exports.updateLastSuccessfulLogin(app, userId);
    const accessToken = yield exports.createSession(app, userId);
    return { userId, accessToken };
});
exports.createSession = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    const accessToken = cryptoHelper.createRandomString();
    const query = queries_1.default.user.createSession(app.module.user.sessionTimeout);
    yield app.db.execute(query, [accessToken, userId]);
    return accessToken;
});
exports.logInWithEmail = (app, email, password) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isEmail(email))
        throw Error("INVALID_INPUT");
    if (!validateHelper.isPassword(app, password))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findByEmail(app, email);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    if (yield passwordComponent.userIsLocked(app, userRecord.id))
        throw Error("LOGIN_LOCKED");
    if (!(yield passwordComponent.userHasPassword(app, userRecord.id)))
        throw Error("USER_HAS_NO_PASSWORD");
    if (yield passwordComponent.verifyUserPassword(app, userRecord.id, password)) {
        yield passwordComponent.increaseNumberOfFailedLoginAttempts(app, userRecord.id);
        const userLocked = yield passwordComponent.lockUserIfRequired(app, userRecord.id);
        if (userLocked) {
            throw Error("LOGIN_LOCKED");
        }
        else {
            throw Error("PASSWORD_INCORRECT");
        }
    }
    return yield exports.startSession(app, userRecord.id);
});
exports.logInWithAppleIdentifier = (app, appleIdentifier) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isString(appleIdentifier))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findByAppleIdentifier(app, appleIdentifier);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    const userIsLocked = yield passwordComponent.userIsLocked(app, userRecord.id);
    if (userIsLocked)
        throw Error("LOGIN_LOCKED");
    return yield exports.startSession(app, userRecord.id);
});
exports.createUserOrLogInWithAppleIdentifier = (app, appleIdentifier) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isString(appleIdentifier))
        throw Error("INVALID_INPUT");
    const userExists = yield existsComponent.appleIdentifierExists(app, appleIdentifier);
    if (!userExists) {
        yield createComponent.createWithAppleIdentifier(app, appleIdentifier);
    }
    return yield exports.logInWithAppleIdentifier(app, appleIdentifier);
});
exports.logInWithToken = (app, token) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isString(token))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findByLoginToken(app, token);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    yield app.db.execute(queries_1.default.user.setLoginToken(), [null, userRecord.id]);
    return yield exports.startSession(app, userRecord);
});
exports.sendLoginLink = (app, email = null, loginLinkBaseUrl) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isEmail(email))
        throw Error("INVALID_INPUT");
    if (!validateHelper.isString(loginLinkBaseUrl))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findByEmail(app, email);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    const userId = userRecord.id;
    const loginToken = yield exports.setLoginToken(app, userId);
    const mail = {
        from: app.module.mailer.sender,
        to: userRecord.email,
        subject: "Your Login Link",
        text: "Your login link is: " + loginLinkBaseUrl + loginToken
    };
    yield app.mailer.sendMail(mail);
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
exports.updateLastSuccessfulLogin = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    return yield app.db.execute(queries_1.default.user.updateLastSuccessfulLoginForUserId(), [userId]);
});
exports.setLoginToken = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    const loginToken = cryptoHelper.createRandomString();
    yield app.db.execute(queries_1.default.user.setLoginToken(), [loginToken, userId]);
    return loginToken;
});
//# sourceMappingURL=session.js.map