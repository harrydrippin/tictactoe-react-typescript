import * as React from 'react';
import './BoardBox.css';

import { TurnMark } from '../../constants';

export interface IBoardBoxProps {
  model: number[];
  modelIndex: number;
  onBoardClick: (index: number) => void;
}

class BoardBox extends React.Component<IBoardBoxProps, object> {
  constructor(props: IBoardBoxProps) {
    super(props);

    this.onBoardClickBinder = this.onBoardClickBinder.bind(this);
  }

  public render() {
    const { model, modelIndex } = this.props;

    const turnMark: TurnMark = model[modelIndex];

    return <button className="board" data-id={modelIndex} onClick={this.onBoardClickBinder} dangerouslySetInnerHTML={ 
      {__html: (turnMark === TurnMark.TURN_O ? 'O' : turnMark === TurnMark.TURN_X ? 'X' : '&nbsp;')}
    } />;
  }

  private onBoardClickBinder() {
    const { modelIndex, onBoardClick } = this.props;
    onBoardClick(modelIndex);
    this.forceUpdate();
  }
}

export default BoardBox;