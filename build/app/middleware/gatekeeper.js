"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function gatekeeper(req, res, next) {
    try {
        if (req.accessGranted === true) {
            next();
        }
        else {
            next(Error("ACCESS_DENIED"));
        }
    }
    catch (error) {
        next(error);
    }
}
exports.default = gatekeeper;
//# sourceMappingURL=gatekeeper.js.map