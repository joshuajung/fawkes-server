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
const http_1 = require("http");
const Io = require("socket.io");
const userComponent = require("../components/user");
class SocketManager {
    constructor(app) {
        this.app = app;
        this.server = new http_1.Server(this.app);
        this.io = Io(this.server);
        this.socketAuthenticationInformation = [];
        this.io.on("connection", socket => this.registerNewConnection(socket));
    }
    registerNewConnection(socket) {
        console.log("Registered socket connection:");
        console.log(socket);
        this.registerListeners(socket);
    }
    registerListeners(socket) {
        socket.on("disconnect", () => this.unregisterConnection(socket));
        socket.on("authenticate", sessionAccessToken => this.authenticateSocket(socket, sessionAccessToken));
    }
    unregisterConnection(socket) {
        console.log("Unregistered socket connection:");
        console.log(socket);
        this.socketAuthenticationInformation = this.socketAuthenticationInformation.filter(i => i.socketId !== socket.id);
    }
    authenticateSocket(socket, sessionAccessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionIsValid = yield userComponent.checkAndRefreshSession(this.app, sessionAccessToken);
            if (sessionIsValid) {
                const existingIndex = this.socketAuthenticationInformation.findIndex(i => i.socketId === socket.id);
                if (existingIndex !== -1) {
                    this.socketAuthenticationInformation[existingIndex].sessionAccessToken = sessionAccessToken;
                }
                else {
                    this.socketAuthenticationInformation.push({
                        socketId: socket.id,
                        sessionAccessToken: sessionAccessToken
                    });
                }
                console.log("Socket " +
                    socket.id +
                    " authenticated with session " +
                    sessionAccessToken +
                    ".");
                socket.emit("AUTHENTICATED");
            }
            else {
                console.log("Could not authenticate, as session is not valid.");
                socket.emit("AUTHENTICATION_FAILED");
            }
        });
    }
    getSocketsForSession(sessionAccessToken) {
        const allSockets = this.io.sockets.sockets;
        const socketsForSession = this.socketAuthenticationInformation
            .filter(sai => sai.sessionAccessToken === sessionAccessToken)
            .map(sai => allSockets[sai.socketId]);
        return socketsForSession;
    }
}
exports.SocketManager = SocketManager;
//# sourceMappingURL=socket.js.map