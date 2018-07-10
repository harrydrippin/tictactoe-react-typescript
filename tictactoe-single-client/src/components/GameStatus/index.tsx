import * as React from 'react';
import './GameStatus.css';

import { JudgeResult, TurnMark } from '../../constants';

export interface IGameStatusProps {
  turn: number;
  judge: JudgeResult;
  onRestartClick: () => void;
}

class GameStatus extends React.Component<IGameStatusProps, object> {
  constructor(props: any) {
    super(props);

    this.onRestartClickBinder = this.onRestartClickBinder.bind(this);
  }
  
  public render() {
    const {turn, judge} = this.props;

    return (
      <div className="status-board">
        {this.renderTurnMark(judge, turn)}
        {this.renderResultString(judge)}
        {this.renderRestartButton(judge)}
        <hr />
      </div>
    );
  }

  private renderTurnMark(judge: JudgeResult, turn: number): JSX.Element {
    if (judge === JudgeResult.KEEP_RUNNING) {
      return (<h4 className="turn-mark">Turn: {(turn === TurnMark.TURN_O) ? "O" : "X"}</h4>);
    } else {
      return (<span />);
    }
  }

  private renderResultString(judge: JudgeResult): JSX.Element {
    if (judge === JudgeResult.KEEP_RUNNING) {
      return <span />
    } else {
      let resultString: string;
      if (judge === JudgeResult.O_WIN) {
        resultString = "Player O Win!";
      } else if (judge === JudgeResult.X_WIN) {
        resultString = "Player X Win!"; 
      } else {
        resultString = "Draw!";
      }

      return (<h3 className="result-string">{resultString}</h3>);
    }
  }

  private renderRestartButton(judge: JudgeResult): JSX.Element {
    return (judge !== JudgeResult.KEEP_RUNNING) ? (<button type="button" className="btn btn-primary" onClick={this.onRestartClickBinder}>Restart</button>) : <span />;
  }

  private onRestartClickBinder() {
    const { onRestartClick } = this.props;
    onRestartClick();
  }
}

export default GameStatus;