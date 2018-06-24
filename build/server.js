"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const http_1 = require("http");
exports.Server = http_1.Server;
const app_1 = require("./app");
exports.createApp = app_1.default;
const cryptoHelper = require("./app/helpers/crypto");
exports.cryptoHelper = cryptoHelper;
//# sourceMappingURL=server.js.map