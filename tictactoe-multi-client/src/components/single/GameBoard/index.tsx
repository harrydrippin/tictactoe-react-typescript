import * as React from 'react';
import './GameBoard.css';

import BoardBox from '../../../containers/single/BoardBox';

class GameBoard extends React.Component<object, object> {
  public render() {
    return (
      <div className="game-board container">
        <div className="row">
          <BoardBox modelIndex={0} />
          <BoardBox modelIndex={1} />
          <BoardBox modelIndex={2} />
        </div>
    
        <div className="row">
          <BoardBox modelIndex={3} />
          <BoardBox modelIndex={4} />
          <BoardBox modelIndex={5} />
        </div>
    
        <div className="row">
          <BoardBox modelIndex={6} />
          <BoardBox modelIndex={7} />
          <BoardBox modelIndex={8} />
        </div>
      </div>
    );
  }
}

export default GameBoard;

