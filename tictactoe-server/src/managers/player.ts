import Player from "../models/player";

class PlayerManager {
  private players: object;

  constructor() {
    this.players = {};
  }

  public addPlayer(player: Player) {
    this.players[player.getSocket().id] = player;
  }

  public removePlayer(id: string) {
    delete this.players[id];
  }

  public findPlayerBySocketId(id: string): Player | undefined {
    return this.players[id];
  }
}

export default PlayerManager;