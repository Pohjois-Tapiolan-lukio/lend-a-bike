import React, { Component } from 'react';

import Titlebar from './Titlebar';
import Lend from './Lend';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      titlebar: {
        dimensions: {
          height: 0,
        },
      },
    };
  }

  handleTitlebarResize = contentRect => {
    console.log(contentRect);
    this.setState({
      titlebar: {
        dimensions: contentRect.bounds,
      },
    });
  };

  render() {
    return (
      <div>
        <Titlebar handleResize={this.handleTitlebarResize} />
        <Lend marginTop={this.state.titlebar.dimensions.height} />
      </div>
    );
  }
}

export default App;

// vim: et ts=2 sw=2 :
