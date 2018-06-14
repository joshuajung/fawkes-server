"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Express = require("express");
const bodyParser = require("body-parser");
const Helmet = require("helmet");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("source-map-support/register");
const routes = require("./routes");
const logError_1 = require("./middleware/logError");
const sendHttpError_1 = require("./middleware/sendHttpError");
const catchError_1 = require("./middleware/catchError");
const catchAllRoutes_1 = require("./middleware/catchAllRoutes");
const readRequestAuthTokens_1 = require("./middleware/readRequestAuthTokens");
const refreshSession_1 = require("./middleware/refreshSession");
const addUserInformation_1 = require("./middleware/addUserInformation");
const gatekeeper_1 = require("./middleware/gatekeeper");
const AdvancedData = require("./middleware/advancedData");
const createPool_1 = require("./database/createPool");
const moduleLoader_1 = require("./helpers/moduleLoader");
const scheduler_1 = require("./helpers/scheduler");
function App(module) {
    const app = Express();
    app.module = moduleLoader_1.default(module);
    app.db = createPool_1.default(app.module.database);
    app.mailer = nodemailer.createTransport(app.module.mailer.transporterConfiguration);
    app.use(Helmet());
    app.use(cors());
    app.use(readRequestAuthTokens_1.default(app));
    app.use(refreshSession_1.default(app));
    app.use(addUserInformation_1.default(app));
    app.use(bodyParser.json());
    app.use(AdvancedData.JsonToAdvancedData(app));
    routes.setupAuthRoutes(app);
    module.advancedObjects.forEach(ao => ao.registerAuthRoutes(app));
    app.use(gatekeeper_1.default);
    routes.setupExeRoutes(app);
    module.advancedObjects.forEach(ao => ao.registerExeRoutes(app));
    app.use(catchAllRoutes_1.default);
    app.use(logError_1.default(app));
    app.use(sendHttpError_1.default);
    app.use(catchError_1.default);
    app.scheduler = new scheduler_1.Scheduler(app, module.scheduledJobs || []);
    return app;
}
exports.default = App;
//# sourceMappingURL=index.js.map