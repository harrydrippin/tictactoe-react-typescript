import * as React from 'react';
import './Header.css';

class Header extends React.Component {
  public render() {
    const spanStyle:any = {
      color: "#BFBFBF"
    };

    return (
      <header>
        <h1>Tic Tac Toe <span style={spanStyle}>Remastered</span></h1>
        <hr />
      </header>
    );
  };
}

export default Header;