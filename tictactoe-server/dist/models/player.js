"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Player {
    constructor(name, socket) {
        this.name = name;
        this.socket = socket;
    }
    setName(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
    getSocket() {
        return this.socket;
    }
}
exports.default = Player;
