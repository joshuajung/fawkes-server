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
const userSettingsHelper = require("../../helpers/userSettings");
const queries_1 = require("../../database/queries");
const validateHelper = require("../../helpers/validate");
exports.setSetting = (app, userId, settingKey, settingValue) => __awaiter(this, void 0, void 0, function* () {
    if (!validateHelper.isString(settingKey))
        throw Error("INVALID_INPUT");
    yield app.db.execute(queries_1.default.user.setUserSetting(), [
        cryptoHelper.createGuid(),
        userId,
        settingKey,
        settingValue.toDb(),
        settingValue.toDb()
    ]);
});
exports.setSettings = (app, userId, settings) => __awaiter(this, void 0, void 0, function* () {
    yield Promise.all(settings.map((setting) => __awaiter(this, void 0, void 0, function* () {
        return exports.setSetting(app, userId, setting.settingKey, setting.settingValue);
    })));
});
exports.settings = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    const rawResults = yield app.db.execute(queries_1.default.user.getUserSettings(), [
        userId
    ]);
    return app.module.userSettings
        .map(userSettingDefinition => {
        const rawValueRow = rawResults[0].find(row => row["settingKey"] === userSettingDefinition.key);
        return Object.assign({}, userSettingDefinition, { value: userSettingsHelper.parseFromDb(app, rawValueRow, userSettingDefinition) });
    })
        .filter(s => s);
});
//# sourceMappingURL=settings.js.map