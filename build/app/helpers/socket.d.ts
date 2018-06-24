/// <reference types="node" />
/// <reference types="socket.io" />
import { Server } from "http";
import * as Io from "socket.io";
import { App } from "../types";
export declare class SocketManager {
    app: App;
    server: Server;
    io: Io.Server;
    activeConnections: Array<any>;
    constructor(app: App);
    registerNewConnection(socket: any): void;
    unregisterConnection(socket: any): void;
}
