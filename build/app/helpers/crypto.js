"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const hashPassword = require("password-hash");
exports.hashPassword = hashPassword;
const hashObject = require("object-hash");
exports.hashObject = hashObject;
const uuid_1 = require("uuid");
exports.createGuid = uuid_1.v4;
function createRandomString(maxLength = 64) {
    const buf = crypto.randomBytes(maxLength / 2);
    return buf.toString("hex").substr(0, maxLength);
}
exports.createRandomString = createRandomString;
//# sourceMappingURL=crypto.js.map