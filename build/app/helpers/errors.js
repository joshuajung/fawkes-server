"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors = {
    TEST_ERROR: {
        code: "TEST_ERROR",
        publicCode: "TEST_ERROR",
        httpStatus: 418
    },
    OTHER_ERROR: {
        code: "OTHER_ERROR",
        publicCode: "OTHER_ERROR",
        httpStatus: 500
    },
    NOT_FOUND: {
        code: "NOT_FOUND",
        publicCode: "NOT_FOUND",
        httpStatus: 404
    },
    ACCESS_DENIED: {
        code: "ACCESS_DENIED",
        publicCode: "ACCESS_DENIED",
        httpStatus: 403
    },
    ACCESS_TOKEN_INVALID: {
        code: "ACCESS_TOKEN_INVALID",
        publicCode: "ACCESS_TOKEN_INVALID",
        httpStatus: 406
    },
    EMAIL_IN_USE: {
        code: "EMAIL_IN_USE",
        publicCode: "EMAIL_IN_USE",
        httpStatus: 406
    },
    USER_DOES_NOT_EXIST: {
        code: "USER_DOES_NOT_EXIST",
        publicCode: "LOGIN_DATA_INCORRECT",
        httpStatus: 406
    },
    USER_HAS_NO_EMAIL_ADDRESS: {
        code: "USER_HAS_NO_EMAIL_ADDRESS",
        publicCode: "USER_HAS_NO_EMAIL_ADDRESS",
        httpStatus: 406
    },
    USER_NOT_ADDED_TO_GROUP: {
        code: "USER_NOT_ADDED_TO_GROUP",
        publicCode: "USER_NOT_ADDED_TO_GROUP",
        httpStatus: 406
    },
    PASSWORD_INCORRECT: {
        code: "PASSWORD_INCORRECT",
        publicCode: "LOGIN_DATA_INCORRECT",
        httpStatus: 406
    },
    RESET_PASSWORD_TOKEN_INCORRECT: {
        code: "RESET_PASSWORD_TOKEN_INCORRECT",
        publicCode: "RESET_PASSWORD_TOKEN_INCORRECT",
        httpStatus: 406
    },
    LOGIN_LOCKED: {
        code: "LOGIN_LOCKED",
        publicCode: "LOGIN_LOCKED",
        httpStatus: 406
    },
    INVALID_INPUT: {
        code: "INVALID_INPUT",
        publicCode: "INVALID_INPUT",
        httpStatus: 400
    }
};
exports.default = errors;
//# sourceMappingURL=errors.js.map