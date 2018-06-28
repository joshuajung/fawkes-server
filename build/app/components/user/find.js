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
const queries_1 = require("../../database/queries");
const support_1 = require("../../../support");
const groupsComponent = require("./groups");
exports.findById = (app, id) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isGuid(id))
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserById(), [
        id
    ]))[0];
    if (userRecords.length === 0) {
        return null;
    }
    else if (userRecords.length === 1) {
        return userRecords[0];
    }
    else {
        throw Error("OTHER_ERROR");
    }
});
exports.findByEmail = (app, email) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isEmail(email))
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByEmail(), [
        email
    ]))[0];
    if (userRecords.length === 0) {
        return null;
    }
    else if (userRecords.length === 1) {
        return userRecords[0];
    }
    else {
        throw Error("OTHER_ERROR");
    }
});
exports.findByAppleIdentifier = (app, appleIdentifier) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isGuid(appleIdentifier))
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByAppleIdentifier(), [appleIdentifier]))[0];
    if (userRecords.length === 0) {
        return null;
    }
    else if (userRecords.length === 1) {
        return userRecords[0];
    }
    else {
        throw Error("OTHER_ERROR");
    }
});
exports.findByResetPasswordToken = (app, resetPasswordToken) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isString(resetPasswordToken))
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByResetPasswordToken(), [resetPasswordToken]))[0];
    if (userRecords.length === 0) {
        return null;
    }
    else if (userRecords.length === 1) {
        return userRecords[0];
    }
    else {
        throw Error("OTHER_ERROR");
    }
});
exports.findByLoginToken = (app, loginToken) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isString(loginToken))
        throw Error("INVALID_INPUT");
    const userRecords = (yield app.db.execute(queries_1.default.user.getUserByLoginToken(), [loginToken]))[0];
    if (userRecords.length === 0) {
        return null;
    }
    else if (userRecords.length === 1) {
        return userRecords[0];
    }
    else {
        throw Error("OTHER_ERROR");
    }
});
exports.findByAccessToken = (app, accessToken) => __awaiter(this, void 0, void 0, function* () {
    const userQuery = queries_1.default.user.getUserForSessionToken();
    const userQueryResult = yield app.db.execute(userQuery, [accessToken]);
    const userRecords = userQueryResult[0];
    if (userRecords.length === 0) {
        return null;
    }
    else if (userRecords.length === 1) {
        return userRecords[0];
    }
    else {
        throw Error("OTHER_ERROR");
    }
});
exports.getRichUserRecordById = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    const userRecord = yield exports.findById(app, userId);
    if (!userRecord)
        return null;
    const userGroupKeys = yield groupsComponent.groupsForUser(app, userId);
    return {
        userId: userRecord.id,
        email: userRecord.email,
        userGroups: userGroupKeys
    };
});
//# sourceMappingURL=find.js.map