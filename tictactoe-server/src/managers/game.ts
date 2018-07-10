import Game, { CheckBoardResult, GameState, Turn } from "../models/game";
import { v4 } from 'uuid';
import Player from "../models/player";
import { IOutputCheckBoard } from "../models/messages";

class GameManager {
  private games: object;

  constructor() {
    this.games = [];
  }

  public newGame(player: Player): string {
    const gameUuid: string = v4();
    let game = new Game(gameUuid, player);
    this.games[gameUuid] = game;
    return gameUuid;
  }

  public joinGame(player: Player, uuid: string): Game | undefined {
    const selected = this.games[uuid];
    if (selected === undefined) {
      return undefined;
    }
    selected.join(player);
    return selected;
  }

  public checkBoard(uuid: string, player: Player, index: number): IOutputCheckBoard | undefined {
    const selected: Game | undefined = this.findGameByUuid(uuid);
    if (selected === undefined) {
      return undefined;
    }
    
    const result: CheckBoardResult = selected.checkBoard(player, index);

    if (result > 0) {
        selected.setState(GameState.GAME_OVER);
    }

    return {
      uuid: uuid,
      result: result,
      state: selected.getState(),
      model: selected.getModel(),
      turn: selected.getTurn()
    };
  }

  public restart(uuid: string): Game | undefined {
    const selected: Game | undefined = this.findGameByUuid(uuid);
    if (selected === undefined) {
      return undefined;
    }

    selected.setModel([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    selected.setTurn(Turn.O);

    let players: Player[] = selected.getPlayers();
    players.push(players[0]);
    players.splice(0, 1);
    selected.setPlayers(players);

    selected.setState(GameState.GAME_RUNNING);

    return selected;
  }

  public findGameByUuid(uuid: string): Game | undefined {
    return this.games[uuid];
  }

  public findGameByPlayer(player: Player): Game | undefined {
    const reqSocketId: string = player.getSocket().id;
    let foundGame: Game | undefined = undefined;
    for (let uuid in this.games) {
      const game: Game = this.games[uuid];
      game.getPlayers().forEach(function (value, index, array) {
        if (value.getSocket().id == reqSocketId) {
          foundGame = game;
        }
      });

      if (foundGame) break;
    }

    return foundGame;
  }

  public getGames(): object {
    return this.games;
  }
}

export default GameManager;