import React, { Component } from 'react';

import Titlebar from './Titlebar';
import Lend from './Lend';

DataContext = React.createContext();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: 'testtoken',
    };
  }

  setToken = token => this.setState({ token });
  render() {
    return (
      <div>
        <Titlebar setToken={this.setToken} adminToken={this.state.token} />
        <Lend adminToken={this.state.token} />
      </div>
    );
  }
}

export default App;

// vim: et ts=2 sw=2 :
