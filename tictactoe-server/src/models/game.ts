import Player from "./player";

export enum GameState {
  GAME_PREPARING,
  GAME_RUNNING,
  GAME_OVER
};

export enum CheckBoardResult {
  KEEP_RUNNING = 0,
  O_WIN = 1,
  X_WIN = 2,
  DRAW = 3,
  PLAYER_NOT_EXPECTED = -1,
  NOT_YOUR_TURN = -2,
  ALREADY_MARKED = -3,
  MARK_AFTER_GAME_OVER = -4
}

export enum Turn {
  O = 1,
  X = -1
}

class Game {
  private uuid: string;
  private players: Player[];
  private state: GameState;
  private model: number[];
  private turn: Turn;

  constructor(uuid: string, maker: Player) {
    this.uuid = uuid;
    this.players = [];
    this.players.push(maker);
    this.state = GameState.GAME_PREPARING;
  }

  public join(player: Player) {
    this.players.push(player);
    this.model = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    // TODO(@harrydrippin): Make initial turn selection to random
    this.turn = Turn.O;
    this.state = GameState.GAME_RUNNING;
  }

  public getState(): GameState {
    return this.state;
  }

  public getModel(): number[] {
    return this.model;
  }

  public getTurn(): Turn {
    return this.turn;
  }

  public getUuid(): string {
    return this.uuid;
  }

  public getPlayers(): Player[] {
    return this.players;
  }

  public setState(state: GameState) {
    this.state = state;
  }

  public setModel(model: number[]) {
    this.model = model;
  }

  public setTurn(turn: Turn) {
    this.turn = turn;
  }

  public setPlayers(players: Player[]) {
    this.players = players;
  } 

  public checkBoard(player: Player, index: number): CheckBoardResult {
    const turnPlayerIndex: number = player.getSocket() === this.players[0].getSocket() ? 1 
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
    const result: CheckBoardResult = this.judgeBoard(this.model);
    this.turn = this.turn * -1;

    // Whatever the result is, just return it
    return result;
  }

  private judgeBoard(board: number[]): CheckBoardResult {
    // Horizontal Check
    for (let i = 0; i <= 6; i += 3) {
      const horizontalSum: number = board[i] + board[i + 1] + board[i + 2];
      
      if (horizontalSum === 3) {
        return CheckBoardResult.O_WIN;
      }
  
      if (horizontalSum === -3) {
        return CheckBoardResult.X_WIN;
      }
    }
  
    // Vertical Check
    for (let j = 0; j <= 2; j += 1) {
      const verticalSum: number= board[j] + board[j + 3] + board[j + 6];
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
    } else {
      return CheckBoardResult.KEEP_RUNNING;
    }
  }
}

export default Game;