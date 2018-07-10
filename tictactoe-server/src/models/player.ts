import { Socket } from "socket.io";

class Player {
  private name: string;
  private socket: Socket;

  constructor(name: string, socket: Socket) {
    this.name = name;
    this.socket = socket;
  }

  public setName(name: string) {
    this.name = name
  }

  public getName(): string {
    return this.name;
  }

  public getSocket(): Socket {
    return this.socket;
  }
}

export default Player;