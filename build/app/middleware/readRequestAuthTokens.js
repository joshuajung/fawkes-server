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
function ReadRequestAuthTokens(app) {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const headerAccessToken = req.header(app.module.user.accessTokenHeaderName);
            const urlAccessToken = req.params[app.module.user.accessTokenUrlParamName];
            req.accessToken = headerAccessToken || urlAccessToken;
            req.accessTokenIsAvailable =
                (typeof req.accessToken === "undefined") === false;
            next();
        }
        catch (error) {
            next(error);
        }
    });
}
exports.default = ReadRequestAuthTokens;
//# sourceMappingURL=readRequestAuthTokens.js.map