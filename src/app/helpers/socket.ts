// External imports
import { Server } from "http"
import * as Io from "socket.io"

// Internal imports
import { App } from "../types"

export class SocketManager {
  app: App
  server: Server
  io: Io.Server
  activeConnections: Array<any>

  constructor(app: App) {
    this.app = app
    this.server = new Server(this.app)
    this.io = Io(this.server)
    this.activeConnections = []
    this.io.on("connection", socket => this.registerNewConnection(socket))
  }

  registerNewConnection(socket) {
    socket.on("disconnect", () => this.unregisterConnection(socket))
    this.activeConnections.push(socket)
    console.log("Registered socket connection:")
    console.log(socket)
  }

  unregisterConnection(socket) {
    this.activeConnections = this.activeConnections.filter(s => s !== socket)
    console.log("Unregistered socket connection:")
    console.log(socket)
  }
}
