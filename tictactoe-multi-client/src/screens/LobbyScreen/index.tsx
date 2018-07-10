import * as React from 'react';
import './LobbyScreen.css';

import Header from '../../components/common/Header';

import { Link } from 'react-router-dom';
import { MultiGameType } from '../../constants';

interface ILobbyScreenState {
  name: string,
  uuid: string
};

interface ILobbyScreenProps {
  history: any,
  initializeMultiGame: (type: MultiGameType, name: string, uuid: string) => void;
};

class LobbyScreen extends React.Component<ILobbyScreenProps, ILobbyScreenState> {
  public constructor(props: ILobbyScreenProps) {
    super(props);
    this.state = {
      name: "",
      uuid: ""
    };

    this.onUuidChange = this.onUuidChange.bind(this);
    this.onNameChange = this.onNameChange.bind(this);
    this.clearUuid = this.clearUuid.bind(this);
    this.triggerNewGame = this.triggerNewGame.bind(this);
    this.triggerJoinGame = this.triggerJoinGame.bind(this);
  }

  public render() {
    return (
      <div>
        <div className="modal" id="modal-join-game" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Join the game</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input type="text" onChange={this.onUuidChange} value={this.state.uuid} className="form-control" id="join-uuid" placeholder="Paste the UUID from your friend" />
              </div>
              <div className="modal-footer">
                <button type="button" onClick={this.clearUuid} className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" onClick={this.triggerJoinGame} className="btn btn-primary" data-dismiss="modal">Let's Play!</button>
              </div>
            </div>
          </div>
        </div>

        <div className="container wrapper">
          <Header />
          <h3>Play with your friend next of you</h3>
          <Link to="/single">
            <button type="button" className="btn btn-primary">Let's Play!</button>
          </Link>
          <hr />
          <h3>...or your friend over the internet</h3>
          <div className="form-group">
            <label>Username</label>
            <input type="text" onChange={this.onNameChange} value={this.state.name} className="form-control" id="username" placeholder="username" />
            <small className="form-text text-muted">Don't worry for it, I won't post your username on Facebook.</small>
          </div>
          <button type="button" onClick={this.triggerNewGame} className="btn btn-primary">New Game</button>
          <span className="button-guide-text">or</span>
          <button type="button" className="btn btn-secondary"
                  data-target="#modal-join-game"
                  data-toggle="modal">Join Game</button>
          <hr />
          <h3>What is this?</h3>
          <p>This project is practice-purposed project, which contains multiplayer Tic-Tac-Toe game with TypeScript, React.js, Redux, Express.js, Socket.io.</p>
        </div>
      </div>
    );
  }

  private onUuidChange(event: any) {
    this.setState({uuid: event.target.value});
  }

  private onNameChange(event: any) {
    this.setState({name: event.target.value});
  }

  private clearUuid(event: any) {
    this.setState({uuid: ""});
  }

  private triggerNewGame(event: any) {
    if (this.state.name === "") {
      alert("Please type your username.");
      return;
    }
    
    this.props.initializeMultiGame(MultiGameType.NEW, this.state.name, "");

    this.props.history.push("/multi");
  }

  private triggerJoinGame(event: any) {
    if (this.state.name === "") {
      alert("Please type your username.");
      return;
    }

    if (this.state.uuid === "") {
      alert("Please paste your given UUID.");
      return;
    }
    
    this.props.initializeMultiGame(MultiGameType.JOIN, this.state.name, this.state.uuid);
    this.props.history.push("/multi");
  }
}

export default LobbyScreen;