import { Message, MessageType, MessagePayload, ErrorType, InputMessageType, OutputMessageType, IInputJoinGame, IInputCheckBoard, errorOutput, IOutputCheckBoard, IInputRestart, IInputNewGame } from "../models/messages";
import { Server, Socket } from "socket.io";
import getManager from ".";
import GameManager from "./game";
import Player from "../models/player";
import Game from "../models/game";
import PlayerManager from "./player";

class EventManager {
  private static game: GameManager = getManager().getGameManager();
  private static player: PlayerManager = getManager().getPlayerManager();

  public static onConnection(socket: Socket) {
    console.log('[Event] New client was connected: %s', socket.id);
    this.player.addPlayer(new Player("No Name", socket));
  }

  public static onDisconnection(socket: Socket) {
    console.log('[Event] Client just disconnected: %s', socket.id);
    const disconnectedPlayer: Player | undefined = this.player.findPlayerBySocketId(socket.id);
    if (disconnectedPlayer === undefined) return;

    this.player.removePlayer(socket.id);

    const disconnectedGame = this.game.findGameByPlayer(disconnectedPlayer);
    if (disconnectedGame === undefined) return;

    console.log('[Event] Disconnected client has a game, so disappeared');

    disconnectedGame.getPlayers().forEach(function (value, index, array) {
      if (value.getSocket().id !== socket.id) {
        value.getSocket().emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.USER_DISCONNECTED)));
      }
    });
  }

  public static onMessage(io: Server, socket: Socket, m: any) {
    const message: Message = Message.getMessageFromObject(m);

    console.log("[Event] Message arrived");
    console.log(message);

    switch (message.getType()) {
      case InputMessageType.NEW_GAME:
        const maker: Player | undefined = this.player.findPlayerBySocketId(socket.id);
        if (maker === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_PLAYER_BY_SOCKET)));
          break;
        }

        const makerPayload = message.getPayload() as IInputNewGame;
        if (makerPayload === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_PAYLOAD)));
          break;
        }

        maker.setName(makerPayload.name);
        
        const gameUuid: string = this.game.newGame(maker);
        console.log('[Event] New game request by %s', socket.id);
        console.log('[Event] ID: %s', gameUuid);
        socket.emit('message', new Message(OutputMessageType.NEW_GAME, {
          uuid: gameUuid
        }));
        break;

      case InputMessageType.JOIN_GAME:
        const joiner: Player | undefined = this.player.findPlayerBySocketId(socket.id);
        if (joiner === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_PLAYER_BY_SOCKET)));
          break;
        }

        let payload: MessagePayload | undefined = message.getPayload();
        if (payload === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_PAYLOAD)));
          break;
        }

        let joinGamePayload: IInputJoinGame = payload as IInputJoinGame;
        const uuid: string = joinGamePayload.uuid;

        joiner.setName(joinGamePayload.name);

        console.log('[Event] Join game request by %s', socket.id);
        console.log('[Event] ID: %s', uuid);

        const joinResult: Game | undefined = this.game.joinGame(joiner, uuid);
        if (joinResult === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_GAME_BY_UUID)));
          break;
        }

        console.log('[Event] Game established: %s', uuid);
        console.log('[Event] O: ', joinResult.getPlayers()[0].getName());
        console.log('[Event] X: ', joinResult.getPlayers()[1].getName());

        joinResult.getPlayers().forEach(function (value, index, array) {
          value.getSocket().emit('message', new Message(OutputMessageType.GAME_ESTABLISHED, {
            uuid: joinResult.getUuid(),
            players: {
              'O': {
                name: joinResult.getPlayers()[0].getName()
              },
              'X': {
                name: joinResult.getPlayers()[1].getName()
              }
            }
          }));
        });
        break;

      case InputMessageType.CHECK_BOARD:
        const checkBoardMsg: IInputCheckBoard = message.getPayload() as IInputCheckBoard;
        console.log("[Event] Client checked above board")
        console.log(checkBoardMsg);
        if (checkBoardMsg === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_PAYLOAD)));
          break;
        }

        const reqPlayer: Player | undefined = this.player.findPlayerBySocketId(socket.id);

        if (reqPlayer === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_PLAYER_BY_SOCKET)));
          break;
        }

        const reqGame: Game | undefined = this.game.findGameByUuid(checkBoardMsg.uuid);
        const checkBoardResult: IOutputCheckBoard | undefined = this.game.checkBoard(checkBoardMsg.uuid, reqPlayer, checkBoardMsg.index);

        if (reqGame === undefined || checkBoardResult === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_GAME_BY_UUID)));
          break;
        }

        if (checkBoardResult.result < 0) {
          socket.emit('message', new Message(OutputMessageType.CHECK_BOARD, checkBoardResult));
          break;
        }
        
        reqGame.getPlayers().forEach(function (value, index, array) {
          value.getSocket().emit('message', new Message(OutputMessageType.CHECK_BOARD, checkBoardResult));
        });
        break;

      case InputMessageType.RESTART:
        const restartMsg: IInputRestart = message.getPayload() as IInputRestart;
        if (restartMsg === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_PAYLOAD)));
          break;
        }

        const restartGame: Game | undefined = this.game.restart(restartMsg.uuid);
        if (restartGame === undefined) {
          socket.emit('message', new Message(OutputMessageType.ERROR, errorOutput(ErrorType.NO_GAME_BY_UUID)));
          break;
        }

        restartGame.getPlayers().forEach(function (value, index, array) {
          value.getSocket().emit('message', new Message(OutputMessageType.GAME_ESTABLISHED, {
            uuid: restartGame.getUuid(),
            players: {
              'O': {
                name: restartGame.getPlayers()[0].getName()
              },
              'X': {
                name: restartGame.getPlayers()[1].getName()
              }
            }
          }));
        });
        break;

      default:
        break;
    }
  }
}

export default EventManager;