import React, { Component } from 'react';

import Titlebar from './Titlebar';
import Lend from './Lend';
import { Provider } from './DataContext';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      adminToken: 'testtoken',
      bikes: [],
      lendings: [],
    };
  }

  setToken = adminToken => this.setState({ adminToken });
  reloadBikes = () => {
    return fetch('/api/bikes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(result => {
        this.setState({
          bikes: result,
        });
      })
      .catch(error => {
        console.log(error);
      });
  };
  reloadLendings = () => {
    return fetch('/api/lendings', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(result => result.json())
      .then(result => {
        this.setState({
          lendings: result,
        });
      })
      .catch(error => console.log);
    //    fetch('/api/lendings?latest=true', {
    //      method: 'GET',
    //      headers: {
    //        'Content-Type': 'application/json',
    //      },
    //    })
    //      .then(result => result.json())
    //      .then(result => {
    //        this.setState({
    //          latestLendings: result,
    //        });
    //      })
    //      .catch(error => console.log);
  };
  render() {
    return (
      <Provider
        value={{
          ...this.state,
          setToken: this.setToken,
          reloadBikes: this.reloadBikes,
          reloadLendings: this.reloadLendings,
        }}
      >
        <Titlebar />
        <Lend />
      </Provider>
    );
  }
}

export default App;

// vim: et ts=2 sw=2 :
