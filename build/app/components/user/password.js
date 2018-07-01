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
const validateHelper = require("../../helpers/validate");
const queries_1 = require("../../database/queries");
const findComponent = require("./find");
exports.setNewPasswordWithOldPassword = (app, userId, passwordNew, passwordOld) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isString(passwordOld))
        throw Error("INVALID_INPUT");
    if (!validateHelper.isPassword(app, passwordNew))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findById(app, userId);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    if (cryptoHelper.hashPassword.verify(passwordOld, userRecord.password) === false)
        throw Error("PASSWORD_INCORRECT");
    const hashedPassword = cryptoHelper.hashPassword.generate(passwordNew);
    yield app.db.execute(queries_1.default.user.setNewPasswordForUserId(), [
        hashedPassword,
        userId
    ]);
});
exports.setNewPasswordWithToken = (app, token, passwordNew) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isString(token))
        throw Error("INVALID_INPUT");
    if (!validateHelper.isPassword(app, passwordNew))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findByResetPasswordToken(app, token);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    const userId = userRecord["id"];
    yield exports.setNewPassword(app, userId, passwordNew);
    yield exports.voidPasswordResetToken(app, userId);
    yield exports.resetLoginLock(app, userId);
});
exports.sendResetPasswordLink = (app, email = null, resetPasswordLinkBaseUrl) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isEmail(email))
        throw Error("INVALID_INPUT");
    if (!validateHelper.isString(resetPasswordLinkBaseUrl))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findByEmail(app, email);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    const resetPasswordToken = yield exports.setPasswordResetToken(app, userRecord.id);
    const mail = {
        from: app.module.mailer.sender,
        to: userRecord.email,
        subject: "Your reset password link",
        text: "Your reset password link is: " +
            resetPasswordLinkBaseUrl +
            resetPasswordToken
    };
    yield app.mailer.sendMail(mail);
});
exports.setNewPassword = (app, userId, newPassword) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    if (!validateHelper.isPassword(app, newPassword))
        throw Error("INVALID_INPUT");
    const hashedPassword = cryptoHelper.hashPassword.generate(newPassword);
    yield app.db.execute(queries_1.default.user.setNewPasswordForUserId(), [
        hashedPassword,
        userId
    ]);
});
exports.setPasswordResetToken = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    const resetPasswordToken = cryptoHelper.createRandomString();
    yield app.db.execute(queries_1.default.user.setResetPasswordToken(), [
        resetPasswordToken,
        userId
    ]);
    return resetPasswordToken;
});
exports.voidPasswordResetToken = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    yield app.db.execute(queries_1.default.user.setResetPasswordToken(), [null, userId]);
});
exports.userIsLocked = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findById(app, userId);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    const lockedStatusRecords = (yield app.db.execute(queries_1.default.user.checkLoginLockForUserId(), [userId]))[0];
    return lockedStatusRecords[0].loginIsLockedNow;
});
exports.userHasPassword = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findById(app, userId);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    return !!userRecord.password;
});
exports.verifyUserPassword = (app, userId, passwordToVerify) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    if (!validateHelper.isString(passwordToVerify))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findById(app, userId);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    return cryptoHelper.hashPassword.verify(passwordToVerify, userRecord.password);
});
exports.increaseNumberOfFailedLoginAttempts = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findById(app, userId);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    yield app.db.execute(queries_1.default.user.increaseFailedLoginAttemptsForUserId(), [
        userRecord.id
    ]);
});
exports.lockUserIfRequired = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    const userRecord = yield findComponent.findById(app, userId);
    if (!userRecord)
        throw Error("USER_DOES_NOT_EXIST");
    const lockResult = yield app.db.execute(queries_1.default.user.lockUserLoginByUserId(app.module.user.loginLockTimeout), [userRecord.id, app.module.user.failedLoginAttemptsUntilLock]);
    const userLocked = lockResult[0].affectedRows > 0 ? true : false;
    return userLocked;
});
exports.resetLoginLock = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    yield app.db.execute(queries_1.default.user.resetLoginLockForUserId(), [userId]);
});
//# sourceMappingURL=password.js.map