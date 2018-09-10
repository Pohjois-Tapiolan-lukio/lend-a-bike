import React, { Component } from 'react';

import Titlebar from './Titlebar';
import Lend from './Lend';

class App extends Component {
  render() {
    return (
      <div>
        <Titlebar />
        <Lend />
      </div>
    );
  }
}

export default App;

// vim: et ts=2 sw=2 :
