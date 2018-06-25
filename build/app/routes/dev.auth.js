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
    app.get("/dev/helloWorld", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.get("/dev/restricted", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = !!req.userIsLoggedIn;
        next();
    }));
    app.get("/dev/unauthorized", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = false;
        next();
    }));
    app.get("/dev/error", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.get("/dev/debug", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
    app.get("/dev/getSocketForSession", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        req.accessGranted = true;
        next();
    }));
}
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=dev.auth.js.map