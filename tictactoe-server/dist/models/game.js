"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GameState;
(function (GameState) {
    GameState[GameState["GAME_PREPARING"] = 0] = "GAME_PREPARING";
    GameState[GameState["GAME_RUNNING"] = 1] = "GAME_RUNNING";
    GameState[GameState["GAME_OVER"] = 2] = "GAME_OVER";
})(GameState = exports.GameState || (exports.GameState = {}));
;
var CheckBoardResult;
(function (CheckBoardResult) {
    CheckBoardResult[CheckBoardResult["KEEP_RUNNING"] = 0] = "KEEP_RUNNING";
    CheckBoardResult[CheckBoardResult["O_WIN"] = 1] = "O_WIN";
    CheckBoardResult[CheckBoardResult["X_WIN"] = 2] = "X_WIN";
    CheckBoardResult[CheckBoardResult["DRAW"] = 3] = "DRAW";
    CheckBoardResult[CheckBoardResult["PLAYER_NOT_EXPECTED"] = -1] = "PLAYER_NOT_EXPECTED";
    CheckBoardResult[CheckBoardResult["NOT_YOUR_TURN"] = -2] = "NOT_YOUR_TURN";
    CheckBoardResult[CheckBoardResult["ALREADY_MARKED"] = -3] = "ALREADY_MARKED";
    CheckBoardResult[CheckBoardResult["MARK_AFTER_GAME_OVER"] = -4] = "MARK_AFTER_GAME_OVER";
})(CheckBoardResult = exports.CheckBoardResult || (exports.CheckBoardResult = {}));
var Turn;
(function (Turn) {
    Turn[Turn["O"] = 1] = "O";
    Turn[Turn["X"] = -1] = "X";
})(Turn = exports.Turn || (exports.Turn = {}));
class Game {
    constructor(uuid, maker) {
        this.uuid = uuid;
        this.players = [];
        this.players.push(maker);
        this.state = GameState.GAME_PREPARING;
    }
    join(player) {
        this.players.push(player);
        this.model = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        // TODO(@harrydrippin): Make initial turn selection to random
        this.turn = Turn.O;
        this.state = GameState.GAME_RUNNING;
    }
    getState() {
        return this.state;
    }
    getModel() {
        return this.model;
    }
    getTurn() {
        return this.turn;
    }
    getUuid() {
        return this.uuid;
    }
    getPlayers() {
        return this.players;
    }
    setState(state) {
        this.state = state;
    }
    setModel(model) {
        this.model = model;
    }
    setTurn(turn) {
        this.turn = turn;
    }
    setPlayers(players) {
        this.players = players;
    }
    checkBoard(player, index) {
        const turnPlayerIndex = player.getSocket() === this.players[0].getSocket() ? 1
            : player.getSocket() === this.players[1].getSocket() ? -1 : 0;
        // Player not expected
        if (turnPlayerIndex === 0) {
            return CheckBoardResult.PLAYER_NOT_EXPECTED;
        }
        // Not your turn
        if (this.turn !== turnPlayerIndex) {
            return CheckBoardResult.NOT_YOUR_TURN;
        }
        // Mark after game over
        if (this.state === GameState.GAME_OVER) {
            return CheckBoardResult.MARK_AFTER_GAME_OVER;
        }
        // Mark over the mark
        if (this.model[index] !== 0) {
            return CheckBoardResult.ALREADY_MARKED;
        }
        // Mark
        this.model[index] = this.turn;
        const result = this.judgeBoard(this.model);
        this.turn = this.turn * -1;
        // Whatever the result is, just return it
        return result;
    }
    judgeBoard(board) {
        // Horizontal Check
        for (let i = 0; i <= 6; i += 3) {
            const horizontalSum = board[i] + board[i + 1] + board[i + 2];
            if (horizontalSum === 3) {
                return CheckBoardResult.O_WIN;
            }
            if (horizontalSum === -3) {
                return CheckBoardResult.X_WIN;
            }
        }
        // Vertical Check
        for (let j = 0; j <= 2; j += 1) {
            const verticalSum = board[j] + board[j + 3] + board[j + 6];
            if (verticalSum === 3) {
                return CheckBoardResult.O_WIN;
            }
            if (verticalSum === -3) {
                return CheckBoardResult.X_WIN;
            }
        }
        // Cross
        const rightCross = board[0] + board[4] + board[8];
        const leftCross = board[2] + board[4] + board[6];
        if (rightCross === 3 || leftCross === 3) {
            return CheckBoardResult.O_WIN;
        }
        if (rightCross === -3 || leftCross === -3) {
            return CheckBoardResult.X_WIN;
        }
        // Draw or Keep running
        if (board.indexOf(0) === -1) {
            return CheckBoardResult.DRAW;
        }
        else {
            return CheckBoardResult.KEEP_RUNNING;
        }
    }
}
exports.default = Game;
