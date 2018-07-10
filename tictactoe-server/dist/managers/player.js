"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PlayerManager {
    constructor() {
        this.players = {};
    }
    addPlayer(player) {
        this.players[player.getSocket().id] = player;
    }
    removePlayer(id) {
        delete this.players[id];
    }
    findPlayerBySocketId(id) {
        return this.players[id];
    }
}
exports.default = PlayerManager;
