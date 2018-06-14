"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const userSettingsHelper = require("./userSettings");
const primeModule = (module) => {
    module.userSettings = [
        ...userSettingsHelper.coreUserSettings,
        ...module.userSettings
    ];
    return module;
};
exports.default = primeModule;
//# sourceMappingURL=moduleLoader.js.map