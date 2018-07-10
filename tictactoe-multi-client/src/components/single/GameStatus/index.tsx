import * as React from 'react';
import './GameStatus.css';

import { CheckBoardResult, Turn } from '../../../constants';

export interface IGameStatusProps {
  turn: number;
  judge: CheckBoardResult;
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

  private renderTurnMark(judge: CheckBoardResult, turn: number): JSX.Element {
    if (judge === CheckBoardResult.KEEP_RUNNING) {
      return (<h4 className="turn-mark">Turn: {(turn === Turn.O) ? "O" : "X"}</h4>);
    } else {
      return (<span />);
    }
  }

  private renderResultString(judge: CheckBoardResult): JSX.Element {
    if (judge === CheckBoardResult.KEEP_RUNNING) {
      return <span />
    } else {
      let resultString: string;
      if (judge === CheckBoardResult.O_WIN) {
        resultString = "Player O Win!";
      } else if (judge === CheckBoardResult.X_WIN) {
        resultString = "Player X Win!"; 
      } else {
        resultString = "Draw!";
      }

      return (<h3 className="result-string">{resultString}</h3>);
    }
  }

  private renderRestartButton(judge: CheckBoardResult): JSX.Element {
    return (judge !== CheckBoardResult.KEEP_RUNNING) ? (<button type="button" className="btn btn-primary" onClick={this.onRestartClickBinder}>Restart</button>) : <span />;
  }

  private onRestartClickBinder() {
    const { onRestartClick } = this.props;
    onRestartClick();
  }
}

export default GameStatus;