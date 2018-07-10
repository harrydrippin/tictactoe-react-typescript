"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("../models/game");
const uuid_1 = require("uuid");
class GameManager {
    constructor() {
        this.games = [];
    }
    newGame(player) {
        const gameUuid = uuid_1.v4();
        let game = new game_1.default(gameUuid, player);
        this.games[gameUuid] = game;
        return gameUuid;
    }
    joinGame(player, uuid) {
        const selected = this.games[uuid];
        if (selected === undefined) {
            return undefined;
        }
        selected.join(player);
        return selected;
    }
    checkBoard(uuid, player, index) {
        const selected = this.findGameByUuid(uuid);
        if (selected === undefined) {
            return undefined;
        }
        const result = selected.checkBoard(player, index);
        if (result > 0) {
            selected.setState(game_1.GameState.GAME_OVER);
        }
        return {
            uuid: uuid,
            result: result,
            state: selected.getState(),
            model: selected.getModel(),
            turn: selected.getTurn()
        };
    }
    restart(uuid) {
        const selected = this.findGameByUuid(uuid);
        if (selected === undefined) {
            return undefined;
        }
        selected.setModel([0, 0, 0, 0, 0, 0, 0, 0, 0]);
        selected.setTurn(game_1.Turn.O);
        let players = selected.getPlayers();
        players.push(players[0]);
        players.splice(0, 1);
        selected.setPlayers(players);
        selected.setState(game_1.GameState.GAME_RUNNING);
        return selected;
    }
    findGameByUuid(uuid) {
        return this.games[uuid];
    }
    findGameByPlayer(player) {
        const reqSocketId = player.getSocket().id;
        let foundGame = undefined;
        for (let uuid in this.games) {
            const game = this.games[uuid];
            game.getPlayers().forEach(function (value, index, array) {
                if (value.getSocket().id == reqSocketId) {
                    foundGame = game;
                }
            });
            if (foundGame)
                break;
        }
        return foundGame;
    }
    getGames() {
        return this.games;
    }
}
exports.default = GameManager;
