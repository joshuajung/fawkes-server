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
const queries_1 = require("../../database/queries");
const existsComponent = require("./exists");
const support_1 = require("../../../support");
exports.createUserId = () => {
    return cryptoHelper.createGuid();
};
exports.createWithEmail = (app, email, password) => __awaiter(this, void 0, void 0, function* () {
    if (!app.module.user.registrationOpen)
        throw Error("REGISTRATION_CLOSED");
    if (!support_1.validateHelper.isPassword(app, password))
        throw Error("INVALID_INPUT");
    if (!support_1.validateHelper.isEmail(email))
        throw Error("INVALID_INPUT");
    const userExists = yield existsComponent.emailExists(app, email);
    if (userExists)
        throw Error("EMAIL_IN_USE");
    const userId = exports.createUserId();
    yield app.db.execute(queries_1.default.user.createUser(), [
        userId,
        email,
        cryptoHelper.hashPassword.generate(password)
    ]);
    return userId;
});
exports.createWithAppleIdentifier = (app, appleIdentifier) => __awaiter(this, void 0, void 0, function* () {
    if (!app.module.user.allowAppleIdentifierUserCreation)
        throw Error("REGISTRATION_CLOSED");
    if (!support_1.validateHelper.isGuid(appleIdentifier))
        throw Error("INVALID_INPUT");
    const userExists = yield existsComponent.appleIdentifierExists(app, appleIdentifier);
    if (userExists)
        throw Error("EMAIL_IN_USE");
    const userId = exports.createUserId();
    yield app.db.execute(queries_1.default.user.createUser(), [userId, appleIdentifier]);
    return userId;
});
//# sourceMappingURL=create.js.map