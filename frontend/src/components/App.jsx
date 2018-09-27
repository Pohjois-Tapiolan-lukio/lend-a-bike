import React, { Component } from 'react';

import Titlebar from './Titlebar';
import Lend from './Lend';
import AdminDrawer from './AdminDrawer';

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
      <AdminDrawer adminToken={this.state.token}>
        {/*<Titlebar setToken={this.setToken} />*/}
        <Lend adminToken={this.state.token} />
      </AdminDrawer>
    );
  }
}

export default App;

// vim: et ts=2 sw=2 :
