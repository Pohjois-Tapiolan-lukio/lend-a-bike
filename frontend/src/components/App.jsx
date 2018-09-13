import React, { Component } from 'react';

import Titlebar from './Titlebar';
import Lend from './Lend';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  setToken = token => this.setState({ token });
  render() {
    return (
      <div>
        <Titlebar setToken={this.setToken} />
        <Lend adminToken={this.state.token}/>
      </div>
    );
  }
}

export default App;

// vim: et ts=2 sw=2 :
