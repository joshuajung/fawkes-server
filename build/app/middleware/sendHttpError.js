"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("../helpers/errors");
function sendHttpError(err, req, res, next) {
    const errorDetails = errors_1.default[err.message] || errors_1.default["OTHER_ERROR"];
    res.status(errorDetails.httpStatus).send({
        error: true,
        code: errorDetails.publicCode
    });
    next(err);
}
exports.default = sendHttpError;
//# sourceMappingURL=sendHttpError.js.map