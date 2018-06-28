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
const userCreateComponent = require("../components/user/create");
const userExistsComponent = require("../components/user/exists");
const userPasswordComponent = require("../components/user/password");
const userSessionComponent = require("../components/user/session");
const userSettingsComponent = require("../components/user/settings");
const userFindComponent = require("../components/user/find");
function setupRoutes(app) {
    app.post("/user/createWithEmail", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield userCreateComponent.createWithEmail(app, req.body["email"].value, req.body["password"].value);
            const loginResult = yield userSessionComponent.logInWithEmail(app, req.body["email"].value, req.body["password"].value);
            const userInfo = yield userFindComponent.getRichUserRecordById(app, loginResult.userId);
            res.status(201).send({
                code: "USER_CREATED",
                accessToken: loginResult.accessToken,
                userInfo: userInfo
            });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/exists", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield userExistsComponent.emailExists(app, req.body["email"]);
            res.status(200).send({ code: "CHECK_SUCCESSFUL", userExists: result });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/logInWithEmail", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const loginResult = yield userSessionComponent.logInWithEmail(app, req.body["email"].value, req.body["password"].value);
            const userInfo = yield userFindComponent.getRichUserRecordById(app, loginResult.userId);
            res.status(200).send({
                code: "LOGIN_SUCCESSFUL",
                accessToken: loginResult.accessToken,
                userInfo: userInfo
            });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/logInWithToken", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const loginResult = yield userSessionComponent.logInWithToken(app, req.body["token"]);
            const userInfo = yield userFindComponent.getRichUserRecordById(app, loginResult.userId);
            res.status(200).send({
                code: "LOGIN_SUCCESSFUL",
                accessToken: loginResult.accessToken,
                userInfo: userInfo
            });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/sendLoginLink", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield userSessionComponent.sendLoginLink(app, req.body["email"].value, req.body["loginLinkBaseUrl"]);
            res.status(200).send({ code: "LOGIN_LINK_SENT" });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/logOut", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield userSessionComponent.destroySession(app, req.accessToken);
            res.status(200).send({ code: "LOGOUT_SUCCESSFUL" });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/logOutEverywhere", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield userSessionComponent.destroyAllSessions(app, req.userInfo.userId);
            res.status(200).send({ code: "LOGOUT_SUCCESSFUL" });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/setNewPasswordWithOldPassword", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield userPasswordComponent.setNewPasswordWithOldPassword(app, req.userInfo.userId, req.body["newPassword"].value, req.body["oldPassword"].value);
            res.status(200).send({ code: "NEW_PASSWORD_SET" });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/setNewPasswordWithToken", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield userPasswordComponent.setNewPasswordWithToken(app, req.body["token"], req.body["newPassword"].value);
            res.status(200).send({ code: "NEW_PASSWORD_SET" });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/sendResetPasswordLink", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield userPasswordComponent.sendResetPasswordLink(app, req.body["email"].value, req.body["resetPasswordLinkBaseUrl"]);
            res.status(200).send({ code: "RESET_PASSWORD_LINK_SENT" });
        }
        catch (error) {
            next(error);
        }
    }));
    app.post("/user/setUserSetting", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield userSettingsComponent.setSettings(app, req.userInfo.userId, req.body);
            const settings = yield userSettingsComponent.settings(app, req.userInfo.userId);
            res
                .status(200)
                .send({ code: "USER_SETTINGS_SET", userSettings: settings });
        }
        catch (error) {
            next(error);
        }
    }));
    app.get("/user/userSettings", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const settings = yield userSettingsComponent.settings(app, req.userInfo.userId);
            res
                .status(200)
                .send({ code: "USER_SETTINGS_ATTACHED", userSettings: settings });
        }
        catch (error) {
            next(error);
        }
    }));
    app.get("/user/info", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield req.userInfo;
            res.status(200).send({ code: "USER_INFO_ATTACHED", userInfo: result });
        }
        catch (error) {
            next(error);
        }
    }));
}
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=user.exe.js.map