/// <reference types="node" />
/// <reference types="socket.io" />
import { Server } from "http";
import * as Io from "socket.io";
import { App } from "../types";
export declare class SocketManager {
    app: App;
    server: Server;
    io: Io.Server;
    socketAuthenticationInformation: Array<{
        socketId: string;
        sessionAccessToken: string;
    }>;
    constructor(app: App);
    registerNewConnection(socket: Io.Socket): void;
    registerListeners(socket: Io.Socket): void;
    unregisterConnection(socket: Io.Socket): void;
    authenticateSocket(socket: Io.Socket, sessionAccessToken: any): Promise<void>;
    getSocketsForSession(sessionAccessToken: string): Array<Io.Socket>;
}
