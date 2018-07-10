import * as React from 'react';
import './BoardBoxMulti.css';

import { Turn } from '../../../constants';

export interface IBoardBoxMultiProps {
  model: number[];
  modelIndex: number;
  isDisabled: boolean;
  onBoardClick: (index: number) => void;
}

class BoardBoxMulti extends React.Component<IBoardBoxMultiProps, object> {
  constructor(props: IBoardBoxMultiProps) {
    super(props);

    this.onBoardClickBinder = this.onBoardClickBinder.bind(this);
  }

  public render() {
    const { model, modelIndex, isDisabled } = this.props;

    const turnMark: Turn = model[modelIndex];

    return <button className={"board " + (isDisabled ? "disabled" : "")} 
      data-id={modelIndex} onClick={this.onBoardClickBinder} 
      dangerouslySetInnerHTML={ 
        {__html: (turnMark === Turn.O ? 'O' : turnMark === Turn.X ? 'X' : '&nbsp;')}
      } />;
  }

  private onBoardClickBinder() {
    const { modelIndex, onBoardClick } = this.props;
    onBoardClick(modelIndex);
    this.forceUpdate();
  }
}

export default BoardBoxMulti;