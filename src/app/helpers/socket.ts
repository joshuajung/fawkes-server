// External imports
import { Server } from "http"
import * as Io from "socket.io"

// Internal imports
import { App } from "../types"
import * as userSessionComponent from "../components/user/session"

export class SocketManager {
  app: App
  server: Server
  io: Io.Server
  socketAuthenticationInformation: Array<{
    socketId: string
    sessionAccessToken: string
  }>

  constructor(app: App) {
    this.app = app
    this.server = new Server(this.app)
    this.io = Io(this.server)
    this.socketAuthenticationInformation = []
    this.io.on("connection", socket => this.registerNewConnection(socket))
  }

  registerNewConnection(socket: Io.Socket) {
    console.log("Registered socket connection:")
    console.log(socket)
    // Register socket events
    this.registerListeners(socket)
  }

  registerListeners(socket: Io.Socket) {
    socket.on("disconnect", () => this.unregisterConnection(socket))
    socket.on("authenticate", sessionAccessToken =>
      this.authenticateSocket(socket, sessionAccessToken)
    )
  }

  unregisterConnection(socket: Io.Socket) {
    console.log("Unregistered socket connection:")
    console.log(socket)
    this.socketAuthenticationInformation = this.socketAuthenticationInformation.filter(
      i => i.socketId !== socket.id
    )
  }

  async authenticateSocket(socket: Io.Socket, sessionAccessToken) {
    // Check if session ID is valid and get user info
    const sessionIsValid = await userSessionComponent.checkAndRefreshSession(
      this.app,
      sessionAccessToken
    )
    if (sessionIsValid) {
      // Update registry
      const existingIndex = this.socketAuthenticationInformation.findIndex(
        i => i.socketId === socket.id
      )
      if (existingIndex !== -1) {
        this.socketAuthenticationInformation[
          existingIndex
        ].sessionAccessToken = sessionAccessToken
      } else {
        this.socketAuthenticationInformation.push({
          socketId: socket.id,
          sessionAccessToken: sessionAccessToken
        })
      }
      console.log(
        "Socket " +
          socket.id +
          " authenticated with session " +
          sessionAccessToken +
          "."
      )
      socket.emit("AUTHENTICATED")
    } else {
      console.log("Could not authenticate, as session is not valid.")
      socket.emit("AUTHENTICATION_FAILED")
    }
  }

  getSocketsForSession(sessionAccessToken: string): Array<Io.Socket> {
    const allSockets = this.io.sockets.sockets
    const socketsForSession = this.socketAuthenticationInformation
      .filter(sai => sai.sessionAccessToken === sessionAccessToken)
      .map(sai => allSockets[sai.socketId])
    return socketsForSession
  }
}
