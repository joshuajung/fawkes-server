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
function setupRoutes(app) {
    app.post("/user/createWithEmail", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.post("/user/addNativeLogin", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.post("/user/exists", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.post("/user/logInWithEmail", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.post("/user/logInWithToken", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.post("/user/sendLoginLink", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.post("/user/logOut", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = !!req.userIsLoggedIn;
        next();
    }));
    app.post("/user/logOutEverywhere", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = !!req.userIsLoggedIn;
        next();
    }));
    app.post("/user/setNewPasswordWithOldPassword", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = !!req.userIsLoggedIn;
        next();
    }));
    app.post("/user/setNewPasswordWithToken", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.post("/user/sendResetPasswordLink", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.post("/user/setUserSettings", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = !!req.userIsLoggedIn;
        next();
    }));
    app.get("/user/userSettings", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = !!req.userIsLoggedIn;
        next();
    }));
    app.get("/user/info", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = !!req.userIsLoggedIn;
        next();
    }));
}
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=user.auth.js.map