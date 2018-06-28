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
const support_1 = require("../../../support");
const findHelper = require("./find");
exports.idExists = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isGuid(userId))
        throw Error("INVALID_INPUT");
    const user = yield findHelper.findById(app, userId);
    return user !== null;
});
exports.emailExists = (app, email) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isEmail(email))
        throw Error("INVALID_INPUT");
    const user = yield findHelper.findByEmail(app, email);
    return user !== null;
});
exports.appleIdentifierExists = (app, appleIdentifier) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isGuid(appleIdentifier))
        throw Error("INVALID_INPUT");
    const user = yield findHelper.findByAppleIdentifier(app, appleIdentifier);
    return user !== null;
});
//# sourceMappingURL=exists.js.map