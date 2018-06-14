"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const devAuthRoutes = require("./dev.auth");
const devExeRoutes = require("./dev.exe");
const userAuthRoutes = require("./user.auth");
const userExeRoutes = require("./user.exe");
function setupAuthRoutes(app) {
    devAuthRoutes.setupRoutes(app);
    userAuthRoutes.setupRoutes(app);
    app.module.setupAuthRoutes(app);
}
exports.setupAuthRoutes = setupAuthRoutes;
function setupExeRoutes(app) {
    devExeRoutes.setupRoutes(app);
    userExeRoutes.setupRoutes(app);
    app.module.setupExeRoutes(app);
}
exports.setupExeRoutes = setupExeRoutes;
//# sourceMappingURL=index.js.map