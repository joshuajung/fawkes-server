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
const devComponent = require("../components/dev");
function setupRoutes(app) {
    app.get("/dev/helloWorld", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            res.status(200).send({ result: "Hello world." });
        }
        catch (error) {
            next(error);
        }
    }));
    app.get("/dev/restricted", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            res
                .status(200)
                .send({ result: "You have reached the restricted area." });
        }
        catch (error) {
            next(error);
        }
    }));
    app.get("/dev/unauthorized", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            res.status(200).send({
                result: "You have reached the unauthorized area. That's impossible."
            });
        }
        catch (error) {
            next(error);
        }
    }));
    app.get("/dev/error", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield devComponent.error(app);
        }
        catch (error) {
            next(error);
        }
    }));
    app.get("/dev/debug", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield devComponent.debug(app);
        }
        catch (error) {
            next(error);
        }
    }));
    app.get("/dev/getSocketForSession", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            yield devComponent.getSocketForSession(app);
        }
        catch (error) {
            next(error);
        }
    }));
}
exports.setupRoutes = setupRoutes;
//# sourceMappingURL=dev.exe.js.map