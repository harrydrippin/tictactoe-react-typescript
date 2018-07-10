import * as React from 'react';
import './TicTacToe.css';

import GameStatus from '../../containers/GameStatus';
import GameBoard from '../GameBoard';
import Header from '../Header';

class TicTacToe extends React.Component {
  public render() {
    return (
      <div className="container wrapper">
        <Header />
        <GameStatus />
        <GameBoard />
      </div>
    );
  };
}

export default TicTacToe;