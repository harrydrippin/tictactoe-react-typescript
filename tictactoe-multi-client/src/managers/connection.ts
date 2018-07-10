import * as socketIo from 'socket.io-client';
import * as constants from '../constants';

class ConnectionManager {
  private socket: SocketIOClient.Socket;
  private id: string;

  constructor() {
    this.socket = socketIo(constants.URL);
    this.id = this.socket.id;
  }

  public send(m: constants.Message) {
    this.socket.emit('message', m);
  }

  public subscribe(callback: (m: constants.Message) => void) {
    this.socket.on('message', (m: object) => {
      callback(constants.Message.getMessageFromObject(m));
    });
  }

  public getId(): string {
    return this.id;
  }
}

export default ConnectionManager;