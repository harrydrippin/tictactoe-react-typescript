import { createServer, Server } from 'http';
import * as express from 'express';
import * as socketIo from 'socket.io';
import * as path from 'path';
import { Message, MessageType } from './models/messages';
import EventManager from './managers/event';

class GameServer {
    public static readonly PORT: string = process.env.PORT || "8080";
    private app: express.Application;
    private server: Server;
    private io: socketIo.Server;
    private port: string | number;

    constructor() {
        this.app = express();
        this.server = createServer(this.app);
        this.io = socketIo(this.server);

        this.registerServerEvents();
        this.registerServerRoutes();
    }

    private registerServerEvents(): void {
        this.io.on('connect', (socket: socketIo.Socket) => {
            EventManager.onConnection(socket);

            socket.on('message', (m: any) => {
                EventManager.onMessage(this.io, socket, m);
            });

            socket.on('disconnect', () => {
                EventManager.onDisconnection(socket);
            });
        });
    }

    private registerServerRoutes() {
        this.app.get('*', (req, res) => {
            res.send('TicTacToe Server is running! Go to <a href="https://harrydrippin.github.io/tictactoe-react-typescript">Here</a>');
        });
    }

    public listen(): void {
        this.server.listen(parseInt(GameServer.PORT), '0.0.0.0', undefined, () => {
            console.log("[Server] Server starts to listen at port %s", GameServer.PORT);
        });
    }

    public getApp(): express.Application {
        return this.app;
    }
}

export default GameServer;