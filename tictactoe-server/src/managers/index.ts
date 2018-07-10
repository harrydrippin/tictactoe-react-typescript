import GameManager from "./game";
import EventManager from "./event";
import PlayerManager from "./player";

class Manager {
  private game: GameManager;
  private player: PlayerManager;
  
  public getGameManager() {
    if (!this.game) this.game = new GameManager();
    return this.game;
  }

  public getPlayerManager() {
    if (!this.player) this.player = new PlayerManager();
    return this.player;
  }
}

let manager: Manager;

function getManager() {
  if (!manager) manager = new Manager();
  return manager;
}

export default getManager;