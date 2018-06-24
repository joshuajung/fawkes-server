/// <reference types="node" />
import * as Express from "express";
import * as mysql from "mysql2/promise";
import * as nodemailer from "nodemailer";
import * as types from "./index";
import { Scheduler } from "../helpers/scheduler";
import { SocketManager } from "../helpers/socket";
import { Server } from "http";
export interface App extends Express.Application {
    module?: types.Module;
    db?: mysql.IPool;
    mailer?: nodemailer.Transporter;
    scheduler?: Scheduler;
    socketManager?: SocketManager;
    server?: Server;
}
