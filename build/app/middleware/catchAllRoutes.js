"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function catchAllRoutes(req, res, next) {
    next(Error("NOT_FOUND"));
}
exports.default = catchAllRoutes;
//# sourceMappingURL=catchAllRoutes.js.map