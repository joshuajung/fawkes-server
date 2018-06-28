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
const support_1 = require("../../../support");
const existsComponent = require("./exists");
exports.addToGroup = (app, userId, groupKey) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isGuid(userId) || !support_1.validateHelper.isString(groupKey))
        throw Error("INVALID_INPUT");
    const query = queries_1.default.user.addUserIdToGroup();
    const queryResult = yield app.db.execute(query, [
        cryptoHelper.createGuid(),
        userId,
        groupKey
    ]);
    if (queryResult[0].affectedRows !== 1) {
        throw Error("USER_NOT_ADDED_TO_GROUP");
    }
});
exports.groupsForUser = (app, userId) => __awaiter(this, void 0, void 0, function* () {
    if (!support_1.validateHelper.isString(userId))
        throw Error("INVALID_INPUT");
    const exists = yield existsComponent.idExists(app, userId);
    if (!exists)
        throw Error("INVALID_INPUT");
    const userGroupQuery = queries_1.default.user.getUserGroupsForUserId();
    const userGroupQueryResult = yield app.db.execute(userGroupQuery, [userId]);
    const userGroupRecords = userGroupQueryResult[0];
    return userGroupRecords.map(userGroupRecord => userGroupRecord.key);
});
//# sourceMappingURL=groups.js.map