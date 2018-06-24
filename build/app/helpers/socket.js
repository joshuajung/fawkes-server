"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const Io = require("socket.io");
class SocketManager {
    constructor(app) {
        this.app = app;
        this.server = new http_1.Server(this.app);
        this.io = Io(this.server);
        this.activeConnections = [];
        this.io.on("connection", socket => this.registerNewConnection(socket));
    }
    registerNewConnection(socket) {
        socket.on("disconnect", () => this.unregisterConnection(socket));
        this.activeConnections.push(socket);
        console.log("Registered socket connection:");
        console.log(socket);
    }
    unregisterConnection(socket) {
        this.activeConnections = this.activeConnections.filter(s => s !== socket);
        console.log("Unregistered socket connection:");
        console.log(socket);
    }
}
exports.SocketManager = SocketManager;
//# sourceMappingURL=socket.js.map