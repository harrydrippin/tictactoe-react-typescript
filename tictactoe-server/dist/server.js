"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const socketIo = require("socket.io");
const event_1 = require("./managers/event");
class GameServer {
    constructor() {
        this.app = express();
        this.server = http_1.createServer(this.app);
        this.io = socketIo(this.server);
        this.registerServerEvents();
        this.registerServerRoutes();
    }
    registerServerEvents() {
        this.io.on('connect', (socket) => {
            event_1.default.onConnection(socket);
            socket.on('message', (m) => {
                event_1.default.onMessage(this.io, socket, m);
            });
            socket.on('disconnect', () => {
                event_1.default.onDisconnection(socket);
            });
        });
    }
    registerServerRoutes() {
        this.app.get('*', (req, res) => {
            res.send('TicTacToe Server is running! Go to <a href="https://harrydrippin.github.io/tictactoe-react-typescript">Here</a>');
        });
    }
    listen() {
        this.server.listen(GameServer.PORT, '0.0.0.0', undefined, () => {
            console.log("[Server] Server starts to listen at port %s", GameServer.PORT);
        });
    }
    getApp() {
        return this.app;
    }
}
GameServer.PORT = 8080;
exports.default = GameServer;
