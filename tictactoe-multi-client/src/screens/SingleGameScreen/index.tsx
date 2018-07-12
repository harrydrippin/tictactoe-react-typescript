import * as React from 'react';
import './SingleGameScreen.css';

import Header from '../../components/common/Header';
import GameBoard from '../../components/single/GameBoard';
import GameStatus from '../../containers/single/GameStatus';

interface ISingleGameScreenProps {
  markSingle: () => void;
}

class SingleGameScreen extends React.Component<ISingleGameScreenProps, object> {
  constructor(props: ISingleGameScreenProps) {
    super(props);
    this.props.markSingle();
  }

  public render() {
    return (
      <div className="container wrapper">
        <Header />
        <GameStatus />
        <GameBoard />
        <hr />
        <p className="text-muted">Quite boring, eh? Why don't you <a href="/tictactoe-react-typescript">play with your internet friends?</a></p>
      </div>
    );
  };
}

export default SingleGameScreen;