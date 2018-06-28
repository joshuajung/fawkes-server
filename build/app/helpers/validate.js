"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator = require("validator");
const lodash_1 = require("lodash");
const makeString = (input) => input + "";
exports.isNil = value => lodash_1.isNil(value);
exports.isGuid = value => validator.isUUID(makeString(value));
exports.isEmail = value => validator.isEmail(value);
exports.isString = value => typeof value === "string";
exports.isPassword = (app, value) => typeof value === "string" &&
    validator.isLength(value, { min: app.module.user.minPasswordLength });
exports.isAdvancedData = (value, allowedAdvancedDataTypes) => {
    const constructorName = value.constructor.name;
    const isAllowed = allowedAdvancedDataTypes.indexOf(constructorName) !== -1;
    return isAllowed;
};
//# sourceMappingURL=validate.js.map