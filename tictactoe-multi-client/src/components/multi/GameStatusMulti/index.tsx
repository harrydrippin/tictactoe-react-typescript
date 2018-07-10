import * as React from 'react';
import './GameStatusMulti.css';

import { CheckBoardResult, IOutputGameEstablished, Turn } from '../../../constants';
import ConnectionManager from '../../../managers/connection';

import getManager from '../../../managers';

export interface IGameStatusProps {
  turn: Turn;
  judge: CheckBoardResult;
  game?: IOutputGameEstablished;
  name: string;
  onRestartClick: () => void;
}

class GameStatusMulti extends React.Component<IGameStatusProps, object> {
  private conn: ConnectionManager = getManager().getConnectionManager();

  constructor(props: any) {
    super(props);
    const context = this;

    this.conn.subscribe((m) => {
      context.forceUpdate();
    });

    this.onRestartClickBinder = this.onRestartClickBinder.bind(this);
  }
  
  public render() {
    const {turn, judge, game} = this.props;

    return (
      <div className="status-board">
        {this.renderConnectionStatus(game)}
        {this.renderTurnMark(judge, turn)}
        {this.renderResultString(judge)}
        {this.renderRestartButton(judge)}
        <hr />
      </div>
    );
  }

  private renderTurnMark(judge: CheckBoardResult, turn: Turn): JSX.Element {
    const game = this.props.game;
    if (game === undefined) {
      return (<span />);
    }

    const myTurn = (game.players[(turn === Turn.O) ? "O" : "X"].name === this.props.name);

    if (judge === CheckBoardResult.KEEP_RUNNING) {
      if (turn !== Turn.UNDEFINED) {
        return (<h4 className="turn-mark">Turn: {(myTurn) ? "Your Turn!" : "Wait..."}</h4>);
      } else {
        return <span />;
      }
    } else {
      return (<span />);
    }
  }

  private renderResultString(judge: CheckBoardResult): JSX.Element {
    // game.players[(turn === Turn.O) ? "O" : "X"].name === this.props.name);
    const game = this.props.game;
    if (game === undefined) {
      return (<span />);
    }

    if (judge === CheckBoardResult.KEEP_RUNNING) {
      return <span />
    } else {
      let resultString: string;
      if (judge === CheckBoardResult.O_WIN) {
        resultString = (game.players.O.name === this.props.name) ? "You Win!" : "You Lose!";
      } else if (judge === CheckBoardResult.X_WIN) {
        resultString = (game.players.X.name === this.props.name) ? "You Win!" : "You Lose!";
      } else {
        resultString = "Draw!";
      }

      return (<h3 className="result-string">{resultString}</h3>);
    }
  }

  private renderRestartButton(judge: CheckBoardResult): JSX.Element {
    return (judge !== CheckBoardResult.KEEP_RUNNING) ? (<button type="button" className="btn btn-primary" onClick={this.onRestartClickBinder}>Restart</button>) : <span />;
  }

  private renderConnectionStatus(game: IOutputGameEstablished | undefined) {
    if (game === undefined) {
      return <div className="game-status" />;
    } else {
      return (
        <div>
          <div className="game-status">
            <h4> <b>{ game.players.O.name }</b> VS <b>{ game.players.X.name }</b> </h4>
            <h6 className="text-muted">Game ID: { game.uuid }</h6>
          </div>
        </div>
      );
    }
  }

  private onRestartClickBinder() {
    const { onRestartClick } = this.props;
    onRestartClick();
  }
}

export default GameStatusMulti;