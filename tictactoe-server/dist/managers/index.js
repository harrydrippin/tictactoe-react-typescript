"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const game_1 = require("./game");
const player_1 = require("./player");
class Manager {
    getGameManager() {
        if (!this.game)
            this.game = new game_1.default();
        return this.game;
    }
    getPlayerManager() {
        if (!this.player)
            this.player = new player_1.default();
        return this.player;
    }
}
let manager;
function getManager() {
    if (!manager)
        manager = new Manager();
    return manager;
}
exports.default = getManager;
