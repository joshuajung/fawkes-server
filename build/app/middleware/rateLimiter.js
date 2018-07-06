"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const RateLimit = require("express-rate-limit");
function RateLimiter(app) {
    if (app.module.server.rateLimit.enabled) {
        return new RateLimit({
            windowMs: app.module.server.rateLimit.timeFrame * 1000,
            max: app.module.server.rateLimit.numberOfRequests,
            delayMs: 0,
            handler: (req, res) => {
                throw Error("RATE_LIMIT_EXCEEDED");
            }
        });
    }
    else {
        return (req, res, next) => {
            next();
        };
    }
}
exports.default = RateLimiter;
//# sourceMappingURL=rateLimiter.js.map