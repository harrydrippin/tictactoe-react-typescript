import * as React from 'react';
import './MultiGameScreen.css';

import Header from '../../components/common/Header';

import GameBoardMulti from '../../containers/multi/GameBoardMulti';
import GameStatusMulti from '../../containers/multi/GameStatusMulti';

interface IMultiGameScreenProps {
  markMulti: () => void;
}

class MultiGameScreen extends React.Component<IMultiGameScreenProps, object> {
  constructor(props: IMultiGameScreenProps) {
    super(props);
    this.props.markMulti();
  }
  public render() {
    return <div className="container wrapper">
      <Header />
      <GameStatusMulti />
      <GameBoardMulti />
      <hr />
      <p className="text-muted">If you want, you can run away from your scary opponent and <a href="/tictactoe-react-typescript">back to comfortable "lobby" screen.</a></p>
    </div>
  }
}

export default MultiGameScreen;