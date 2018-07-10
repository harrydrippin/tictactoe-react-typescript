import * as React from 'react';
import './GameBoardMulti.css';

import BoardBoxMulti from '../../../containers/multi/BoardBoxMulti';

import getManager from '../../../managers';
import ConnectionManager from '../../../managers/connection';

import { InputMessageType, IOutputCheckBoard, Message, MultiGameType, OutputMessageType} from '../../../constants';

const enum MultiGameState {
  STATE_WAITING_CONNECTION,
  STATE_WAITING_OPPONENT,
  STATE_MATCH_SUCCESS
}

interface IGameBoardMultiProps {
  id: string,
  name: string,
  type: MultiGameType,
  onWaitingOpponent: (m: Message) => void,
  onGameEstablished: (m: Message) => void,
  onBoardUpdate: (payload: IOutputCheckBoard) => void,
  onGameError: (m: Message) => void
}

class GameBoardMulti extends React.Component<IGameBoardMultiProps, object> {
  private conn: ConnectionManager = getManager().getConnectionManager();
  private gameState: MultiGameState;

  constructor(props: IGameBoardMultiProps) {
    super(props);
    const context = this;

    this.gameState = MultiGameState.STATE_WAITING_CONNECTION;

    if (this.props.type === MultiGameType.NEW) {
      this.conn.send(new Message(InputMessageType.NEW_GAME, {
        name: this.props.name
      }));
    } else if (this.props.type) {
      this.conn.send(new Message(InputMessageType.JOIN_GAME, {
        name: this.props.name,
        uuid: this.props.id
      }));
    }

    this.conn.subscribe((m: Message) => {
      console.log(m);
      switch (m.getType()) {
        case OutputMessageType.NEW_GAME:
          context.gameState = MultiGameState.STATE_WAITING_OPPONENT;
          this.props.onWaitingOpponent(m);
          break;
        case OutputMessageType.GAME_ESTABLISHED:
          context.gameState = MultiGameState.STATE_MATCH_SUCCESS;
          this.props.onGameEstablished(m);
          break;
        case OutputMessageType.CHECK_BOARD:
          const payload: IOutputCheckBoard = m.getPayload() as IOutputCheckBoard;
          this.props.onBoardUpdate(payload);
          break;
        case OutputMessageType.ERROR:
          this.props.onGameError(m);
        default:
          break;
      }

      context.forceUpdate();
    });
  }

  public render() {
    return (
      <div>
        { (this.gameState === MultiGameState.STATE_WAITING_CONNECTION) ? this.renderWaitingConnection() : null}
        { (this.gameState === MultiGameState.STATE_WAITING_OPPONENT) ? this.renderWaitingOpponent() : null }
        { (this.gameState === MultiGameState.STATE_MATCH_SUCCESS) ? this.renderGameBoard() : null }
      </div>
    );
  }

  private renderWaitingConnection() {
    return (<div className="card placeholder-waiting-connection">
      <div className="card-body">
        <h5 className="card-title">Waiting for the connection...</h5>
        <h6 className="card-subtitle mb-2 text-muted">STATE_WAITING_CONNECTION</h6>
        <p className="card-text">Now this client is attempting to establish the connection with our game server. Please wait for the seconds.</p>
      </div>
    </div>);
  }

  private renderWaitingOpponent() {
    return (<div className="card placeholder-waiting-opponent">
      <div className="card-body">
        <h5 className="card-title">Connection established, Waiting for the opponent...</h5>
        <h6 className="card-subtitle mb-2 text-muted">STATE_WAITING_OPPONENT</h6>
        <p className="card-text">Now this client established the connection with our game server, and waiting for your friends.<br />As soon as your friend connects, game will start immediately.</p>
      </div>
    </div>);
  }

  private renderGameBoard() {
    return (<div className="game-board container">
      <div className="row">
        <BoardBoxMulti modelIndex={0} />
        <BoardBoxMulti modelIndex={1} />
        <BoardBoxMulti modelIndex={2} />
      </div>
  
      <div className="row">
        <BoardBoxMulti modelIndex={3} />
        <BoardBoxMulti modelIndex={4} />
        <BoardBoxMulti modelIndex={5} />
      </div>
  
      <div className="row">
        <BoardBoxMulti modelIndex={6} />
        <BoardBoxMulti modelIndex={7} />
        <BoardBoxMulti modelIndex={8} />
      </div>
    </div>);
  }
}

export default GameBoardMulti;

