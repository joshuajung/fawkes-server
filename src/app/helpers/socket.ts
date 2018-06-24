// External imports
import { Server } from "http"
import * as Io from "socket.io"

// Internal imports
import { App } from "../types"
import * as userComponent from "../components/user"
import * as cryptoHelper from "./crypto"

export type RoomGatekeeper = (accessToken: string) => boolean

export class SocketManager {
  app: App
  server: Server
  io: Io.Server
  socketAuthenticationInformation: Array<{
    socketId: string
    sessionAccessToken: string
  }>
  roomGatekeepers: Array<{ roomKey: string; gatekeeper: RoomGatekeeper }>

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
    socket.on("join", (roomKey: string) => this.joinRoom(socket, roomKey))
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
    const sessionIsValid = await userComponent.checkAndRefreshSession(
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

  createRoom(gatekeeper: RoomGatekeeper): string {
    const roomKey = cryptoHelper.createGuid()
    this.roomGatekeepers.push({ roomKey, gatekeeper })
    return roomKey
  }

  joinRoom(socket: Io.Socket, roomKey: string) {
    const roomGatekeeper = this.roomGatekeepers.find(
      rg => rg.roomKey == roomKey
    )
    if (!roomGatekeeper) throw Error("NO_ROOM_GATEKEEPER")
    const socketAuthenticationInformation = this.socketAuthenticationInformation.find(
      sai => sai.sessionAccessToken === socket.id
    )
    const sessionAccessToken = socketAuthenticationInformation.socketId || null
    const mayJoin = roomGatekeeper.gatekeeper(sessionAccessToken)
    if (mayJoin) {
      socket.emit("ROOM_JOINED")
    } else {
      socket.emit("NOT_AUTHORIZED")
    }
  }
}
