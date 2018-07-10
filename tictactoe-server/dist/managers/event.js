"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const messages_1 = require("../models/messages");
const _1 = require(".");
const player_1 = require("../models/player");
class EventManager {
    static onConnection(socket) {
        console.log('[Event] New client was connected: %s', socket.id);
        this.player.addPlayer(new player_1.default("No Name", socket));
    }
    static onDisconnection(socket) {
        console.log('[Event] Client just disconnected: %s', socket.id);
        const disconnectedPlayer = this.player.findPlayerBySocketId(socket.id);
        if (disconnectedPlayer === undefined)
            return;
        this.player.removePlayer(socket.id);
        const disconnectedGame = this.game.findGameByPlayer(disconnectedPlayer);
        if (disconnectedGame === undefined)
            return;
        console.log('[Event] Disconnected client has a game, so disappeared');
        disconnectedGame.getPlayers().forEach(function (value, index, array) {
            if (value.getSocket().id !== socket.id) {
                value.getSocket().emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.USER_DISCONNECTED)));
            }
        });
    }
    static onMessage(io, socket, m) {
        const message = messages_1.Message.getMessageFromObject(m);
        console.log("[Event] Message arrived");
        console.log(message);
        switch (message.getType()) {
            case messages_1.InputMessageType.NEW_GAME:
                const maker = this.player.findPlayerBySocketId(socket.id);
                if (maker === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_PLAYER_BY_SOCKET)));
                    break;
                }
                const makerPayload = message.getPayload();
                if (makerPayload === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_PAYLOAD)));
                    break;
                }
                maker.setName(makerPayload.name);
                const gameUuid = this.game.newGame(maker);
                console.log('[Event] New game request by %s', socket.id);
                console.log('[Event] ID: %s', gameUuid);
                socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.NEW_GAME, {
                    uuid: gameUuid
                }));
                break;
            case messages_1.InputMessageType.JOIN_GAME:
                const joiner = this.player.findPlayerBySocketId(socket.id);
                if (joiner === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_PLAYER_BY_SOCKET)));
                    break;
                }
                let payload = message.getPayload();
                if (payload === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_PAYLOAD)));
                    break;
                }
                let joinGamePayload = payload;
                const uuid = joinGamePayload.uuid;
                joiner.setName(joinGamePayload.name);
                console.log('[Event] Join game request by %s', socket.id);
                console.log('[Event] ID: %s', uuid);
                const joinResult = this.game.joinGame(joiner, uuid);
                if (joinResult === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_GAME_BY_UUID)));
                    break;
                }
                console.log('[Event] Game established: %s', uuid);
                console.log('[Event] O: ', joinResult.getPlayers()[0].getName());
                console.log('[Event] X: ', joinResult.getPlayers()[1].getName());
                joinResult.getPlayers().forEach(function (value, index, array) {
                    value.getSocket().emit('message', new messages_1.Message(messages_1.OutputMessageType.GAME_ESTABLISHED, {
                        uuid: joinResult.getUuid(),
                        players: {
                            'O': {
                                name: joinResult.getPlayers()[0].getName()
                            },
                            'X': {
                                name: joinResult.getPlayers()[1].getName()
                            }
                        }
                    }));
                });
                break;
            case messages_1.InputMessageType.CHECK_BOARD:
                const checkBoardMsg = message.getPayload();
                console.log("[Event] Client checked above board");
                console.log(checkBoardMsg);
                if (checkBoardMsg === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_PAYLOAD)));
                    break;
                }
                const reqPlayer = this.player.findPlayerBySocketId(socket.id);
                if (reqPlayer === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_PLAYER_BY_SOCKET)));
                    break;
                }
                const reqGame = this.game.findGameByUuid(checkBoardMsg.uuid);
                const checkBoardResult = this.game.checkBoard(checkBoardMsg.uuid, reqPlayer, checkBoardMsg.index);
                if (reqGame === undefined || checkBoardResult === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_GAME_BY_UUID)));
                    break;
                }
                if (checkBoardResult.result < 0) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.CHECK_BOARD, checkBoardResult));
                    break;
                }
                reqGame.getPlayers().forEach(function (value, index, array) {
                    value.getSocket().emit('message', new messages_1.Message(messages_1.OutputMessageType.CHECK_BOARD, checkBoardResult));
                });
                break;
            case messages_1.InputMessageType.RESTART:
                const restartMsg = message.getPayload();
                if (restartMsg === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_PAYLOAD)));
                    break;
                }
                const restartGame = this.game.restart(restartMsg.uuid);
                if (restartGame === undefined) {
                    socket.emit('message', new messages_1.Message(messages_1.OutputMessageType.ERROR, messages_1.errorOutput(messages_1.ErrorType.NO_GAME_BY_UUID)));
                    break;
                }
                restartGame.getPlayers().forEach(function (value, index, array) {
                    value.getSocket().emit('message', new messages_1.Message(messages_1.OutputMessageType.GAME_ESTABLISHED, {
                        uuid: restartGame.getUuid(),
                        players: {
                            'O': {
                                name: restartGame.getPlayers()[0].getName()
                            },
                            'X': {
                                name: restartGame.getPlayers()[1].getName()
                            }
                        }
                    }));
                });
                break;
            default:
                break;
        }
    }
}
EventManager.game = _1.default().getGameManager();
EventManager.player = _1.default().getPlayerManager();
exports.default = EventManager;
